import { existsSync, globSync, statSync } from "fs";
import { matchesGlob } from "path";

/**
 * Returns the given path only if the file exists.
 * @param {string} configPath - Candidate file path.
 * @returns {string|undefined} The path if it exists, otherwise `undefined`.
 */
function returnIfPresent(configPath) {
    if(existsSync(configPath)) return configPath;
}

/**
 * Resolves a Rollup configuration file from the given path.
 * - If `configPath` is a directory, searches for:
 *   - `rollup.config.js`
 *   - `rollup.config.mjs`
 *   - `rollup.config.cjs`
 * - If it's a file matching `*.js|mjs|cjs`, returns it if present.
 * - Otherwise tries appending `.js` to the path.
 * @param {string} configPath - A directory, file path, or bare module name.
 * @returns {string} Absolute or relative path to the resolved config file.
 * @throws {Error} If no Rollup config file can be resolved.
 */
export default function(configPath) {
    return (
        existsSync(configPath) && statSync(configPath).isDirectory()
        ? globSync(configPath + "/rollup.config.{js,mjs,cjs}")[0]
        : matchesGlob(configPath, "**/*.{js,mjs,cjs}")
            ? returnIfPresent(configPath)
            : returnIfPresent(configPath.concat(".js"))
    ) ?? (() => { throw Error("Rollup config file not found.") })();
}