import minify from "@wc-build/minify";
import { extname, resolve, sep } from "path";
import { watch } from "fs/promises";
import fs from "fs";

// Cache for storing previous contents of watched files
// Used for skipping unnecessary change events
const cache = new Map;

/**
 * Determine whether the minified file content is unchanged since the last read.
 * Uses content hashing via minification to normalize formatting differences and
 * avoid duplicate editor-triggered events.
 * @param {string} filename
 * @returns {Promise<boolean>} `true` if unchanged or unreadable, otherwise `false`
 */
async function isCached(filename) {
    filename = resolve(filename);
    const content = await minify(extname(filename), fs.readFileSync(filename, { encoding: "utf8" }))
        .catch(error => {
            console.error(error);
            return undefined;
        });
    if (!content || cache.get(filename) == content) return true;
    cache.set(filename, content);
    return false;
}

/**
 * Check whether the given path refers to a regular file (not a directory, not a symlink).
 */
function isFile(filename) {
    const stat = fs.statSync(filename);
    return stat.isFile() && !stat.isSymbolicLink();
}

/**
 * Determine whether the file should be ignored based on:
 * – ignoreList patterns
 * – whether it is a real file
 * – whether its content was actually changed (cache check)
 * @param {string} filename - Filename relative to the root
 * @param {string} root - Base directory being watched
 * @param {string[] & { test: function(string): boolean }} ignoreList - Ignore pattern list with a `.test()` helper
 * @returns {Promise<boolean>} `true` if the file should be skipped
 */
async function shouldSkipFile(filename, root, ignoreList) {
    return ignoreList.test(filename) || !isFile(filename) || await isCached(filename)
}

/**
 * Determine if the entire event should be skipped.
 * Conditions:
 * – No filename provided     → skip (nothing useful to react to)
 * – Event is NOT "change"    → skip (e.g., rename events)
 * – File qualifies for skip  → skip
 * This function is a passthrough that forwards its parameters
 * (except for `eventType`) directly to {@link shouldSkipFile}.
 * @param {"change"|"rename"} eventType
 * @returns {Promise<boolean>}
 */
async function shouldSkip(eventType, filename) {
    return filename && (eventType != "change" || await shouldSkipFile(...[...arguments].slice(1)));
}

/**
 * Get list of initial files to prime cache or use startup override.
 * @param {string} root
 * @param {string[] & { test: function(string): boolean }} ignoreList
 * @return {Set<string>} set of statup files
 */
function getStartupFiles(root, ignoreList, startupFiles) {
    startupFiles = (
        startupFiles
        ?? fs.globSync(`${root}/**/*`, { exclude: ignoreList })
    ).filter(isFile);
    startupFiles.forEach(isCached);
    return new Set(startupFiles);
}

/**
 * Return the list of changed files and reset the tracking set.
 * On startup, returns `undefined` to signal an initial run.
 * @param {Set<string>} files
 * @param {{ startup: boolean }} runObj
 * @returns {string[]|undefined}
 */
function emitChangedFiles(files, runObj) {
    const changedFiles = [...files];
    runObj.startup = false;
    files.clear();
    return changedFiles;
}

/**
 * Track file changes asynchronously and populate the provided Set.
 * @param {string} root - Directory to watch (recursive)
 * @param {string[] & { test: function(string): boolean }} ignoreList
 * @param {Set<string>} files - Accumulates changed filenames
 */
async function trackFiles(root, ignoreList, files) {
    for await (let { eventType, filename } of watch(root, { recursive: true })) {
        if (await shouldSkip(eventType, (filename = filename?.replace(/^/i, root.concat(sep))), root, ignoreList)) continue;
        files.add(filename);
    }
}

/**
 * Asynchronous generator that yields batches of changed files.
 * Debounces events using the provided delay.
 * @param {string} root
 * @param {string[] & { test: function(string): boolean }} ignoreList
 * @param {number} delay - Delay in milliseconds for batching file events
 * @param {Set<string>} files - set of statup files
 * @yields {Promise<string[]|undefined>} Promise resolving to list of changed files
 */
async function* registerWatch(root, ignoreList, delay, files) {
    const sleep = delay => new Promise(r => setTimeout(r, delay));
    let runObj = { startup: true };
    trackFiles(root, ignoreList, files);
    while (true) {
        if (files.size) yield sleep(runObj.startup ? 0 : delay)
            .then(() => emitChangedFiles(files, runObj));
        await sleep(0);
    }
}

/**
 * Main watcher reaction handler.
 * Executes the script whenever file changes are detected.
 * @param {{ root: string, ignoreList: string[], script: string, delay: number,  startup: { files: string[] }}} options
 */
export default async function onrestart({root, ignoreList, script, delay, startup: { files: startupFiles }}) {
    for await (const files of registerWatch(root, ignoreList, delay, getStartupFiles(root, ignoreList, startupFiles)))
        try {
            await script(files);
        } catch (error) {
            console.error(error);
        } finally {
            console.info(`Completed running '${script.path}'. Waiting for file changes before restarting...\n`);
        }
}