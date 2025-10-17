import execCommand from "./exec.js";
import { sep } from "path";
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
 * Main watcher reaction handler.
 * Executes the script or skips the event depending on filtering logic.
 * @param {{ root: string, ignoreList: any, script: string }} options
 * @param {"change"|"rename"} eventType
 * @param {string} filename
 */
export default function onrestart({root, ignoreList, script}, eventType, filename) {
    if (shouldSkip(eventType, filename, root, ignoreList))
        return console.log(`Skipping ${eventType} event triggered by: "${filename}"`);
    execCommand(script, filename);
}