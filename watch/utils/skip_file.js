import minify from "minify";
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
function isFile(filename) {
    const stat = fs.statSync(filename);
    return stat.isFile() && !stat.isSymbolicLink();
}

/**
 * Determine whether a filesystem event should be ignored.
 * @param {string} filename - File path.
 * @returns {Promise<boolean>} `true` if the event should be skipped.
 */
export async function shouldSkip(filename) {
    return filename && (!fs.existsSync(filename) || !isFile(filename) || await isCached(filename));
}