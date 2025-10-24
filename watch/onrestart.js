import execCommand from "./exec.js";
import { sep } from "path";
import { watch } from "fs/promises";
import fs from "fs";

// Cache for storing previous contents of watched files
// Used for skipping unnecessary change events
const cache = new Map;

/**
 * Determine whether the file content is unchanged since the last read.
 * Used to ignore duplicate editor events (common in VSCode, JetBrains, etc.)
 */
function isCached(filename) {
    let content;
    if (cache.get(filename) == (content = fs.readFileSync(filename, { encoding: "utf8" }))) return true;
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
 * @param {string & { test: function(string): boolean }} ignoreList - Ignore pattern list with a `.test()` helper
 * @returns {boolean} true if the file should be skipped
 */
function shouldSkipFile(filename, root, ignoreList) {
    filename = root.concat(sep).concat(filename);
    return ignoreList.test(filename) || !isFile(filename) || isCached(filename)
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
 * @returns {boolean}
 */
function shouldSkip(eventType, filename) {
    return filename && (eventType != "change" || shouldSkipFile(...[...arguments].slice(1)));
}

/**
 * Return the list of changed files and reset the tracking set.
 * On startup, returns `undefined` to signal an initial run.
 * @param {Set<string>} files
 * @returns {string[]|undefined}
 */
function emitChangedFiles(files) {
    const changedFiles = [...files];
    files.clear();
    return changedFiles;
}

/**
 * Track file changes asynchronously and populate the provided Set.
 * @param {string} root - Directory to watch (recursive)
 * @param {{ test: function(string): boolean }} ignoreList
 * @param {Set<string>} files - Accumulates changed filenames
 */
async function trackFiles(root, ignoreList, files) {
    for await (const { eventType, filename } of watch(root, { recursive: true })) {
        if (shouldSkip(eventType, filename, root, ignoreList)) continue;
        files.add(filename);
    }
}

/**
 * Asynchronous generator that yields batches of changed files.
 * Debounces events using the provided delay.
 * @param {string} root
 * @param {{ test: function(string): boolean }} ignoreList
 * @param {number} delay - Delay in milliseconds for batching file events
 * @yields {Promise<string[]|undefined>} Promise resolving to list of changed files
 */
async function* registerWatch(root, ignoreList, delay) {
    const files = new Set;
    const sleep = delay => new Promise(r => setTimeout(r, delay));
    trackFiles(root, ignoreList, files);
    yield undefined;
    while (true) {
        if (files.size) yield sleep(delay)
            .then(() => emitChangedFiles(files));
        await sleep(0);
    }
}

/**
 * Main watcher reaction handler.
 * Executes the script whenever file changes are detected.
 * @param {{ root: string, ignoreList: string[], script: string, delay: number }} options
 */
export default async function onrestart({root, ignoreList, script, delay}) {
    for await (const files of registerWatch(root, ignoreList, delay))
        execCommand(script, files);
}