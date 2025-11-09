import { existsSync, statSync } from "fs";
import { matchesGlob } from "path";

/**
 * Resolve a script path, normalize extensions/directories.
 * @param {string} scriptPath - Path to a script file or directory.
 * @returns {string}
 */
export default function(scriptPath) {
    return existsSync(scriptPath) && statSync(scriptPath).isDirectory()
        ? scriptPath.concat("/index.js")
        : matchesGlob(scriptPath, "**/*.js")
            ? scriptPath : scriptPath.concat(".js");
}