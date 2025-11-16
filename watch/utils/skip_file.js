import minify from "@wc-build/minify";
import { extname, resolve } from "path";
import fs from "fs";

const cache = new Map;

/**
 * Check whether the file's *minified* content is unchanged since the last read.
 * @param {string} filename - Path to the file.
 * @returns {Promise<boolean>} Resolves `true` if the file has not changed or
 * if minification failed; otherwise `false`.
 */
export async function isCached(filename) {
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
 * Check whether a path points to a real file (not a directory or symlink).
 * @param {string} filename - Path to test.
 * @returns {boolean} `true` if the path points to a regular file.
 */
export function isFile(filename) {
    const stat = fs.statSync(filename);
    return stat.isFile() && !stat.isSymbolicLink();
}

/**
 * Determine whether a file should be skipped.
 * Conditions:
 * - Matches an ignore pattern
 * - Is not a valid file
 * - Its minified content did not change (cache hit)
 * @param {string} filename - File path.
 * @param {string[] & {test: (path: string) => boolean}} ignoreList - Ignore helper with a `.test()` method.
 * @returns {Promise<boolean>} `true` if the file should be ignored.
 */
async function shouldSkipFile(filename, ignoreList) {
    return ignoreList.test(filename) || !isFile(filename) || await isCached(filename)
}

/**
 * Determine whether a filesystem event should be ignored.
 * This is a passthrough that conditionally forwards everything
 * except `eventType` to {@link shouldSkipFile}.
 * Rules:
 * - No filename → skip
 * - Event is not `"change"` → skip
 * - File itself qualifies for skipping → skip
 * @param {"change"|"rename"} eventType - Filesystem event type.
 * @param {string} filename - Name of the affected file.
 * @returns {Promise<boolean>} `true` if the event should be skipped.
 */
export async function shouldSkip(eventType, filename) {
    return filename && (eventType != "change" || await shouldSkipFile(...[...arguments].slice(1)));
}