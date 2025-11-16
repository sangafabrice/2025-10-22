import { existsSync, statSync } from "fs";
import { matchesGlob, relative, resolve } from "path";
import { pathToFileURL } from "url";

/**
 * Resolve a script path, normalize extensions/directories, and import the module.
 * @param {string} scriptPath - Path to a script file or directory.
 * @returns {Promise<{
 *   script: ((files: string[]) => any | Promise<any>) & { path: string },
 *   startup: { files?: string[] }
 * }>}
 * A promise resolving to the loaded script function and optional startup files config.
 */
export default function(scriptPath) {
    scriptPath =
        existsSync(scriptPath) && statSync(scriptPath).isDirectory()
            ? scriptPath.concat("/index.js")
            : matchesGlob(scriptPath, "**/*.js")
                ? scriptPath : scriptPath.concat(".js");
    return import(pathToFileURL(resolve(scriptPath)).href)
        .then(({ default: script, startup }) => (
            {
                script: Object.assign(script, { path: relative(".", scriptPath) }),
                startup: startup ?? {}
            }
        ));
}