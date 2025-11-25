import { Script, createContext } from "vm";
import { readFileSync } from "fs";
import { pathToFileURL } from "url";
import { dirname, join, resolve } from "path";

let vmscript, scriptname, scriptdir, scriptdir_join;

/**
 * Dynamically resolves and imports modules for Script.
 * Handles both bare specifiers (e.g., "fs") and relative imports
 * by rewriting them relative to the directory containing the root script.
 * @param {string} specifier - The module specifier appearing in `import`.
 * @returns {Promise<any>} Promise resolving to the imported module namespace.
 */
async function importModuleDynamically(specifier) {
    return import(/^\.{1,2}\//.test(specifier) ? scriptdir_join(specifier) : specifier);
}

/**
 * Module Runner Class
 * Loads a script using `vm.Script`, automatically resolves
 * its import dependencies, instantiates and evaluates it.
 * All exports of the module are discarded; this simply executes its top-level code.
 */
export default Object.freeze(new class {
    /**
     * Sets the script path and caches its directory for resolving relative imports.
     * @param {string} pathLike - Path to the root script file.
     */
    setScript(pathLike) {
        scriptname = pathLike;
        scriptdir = dirname(resolve(pathLike));
        scriptdir_join = (specifier) => pathToFileURL(join(scriptdir, specifier));
        vmscript = new Script(readFileSync(pathLike), { filename: pathLike, importModuleDynamically });
    }

    /**
     * Executes the configured script file through a new Script.
     * @param {string[] | undefined} filenames - Optional list of changed filenames.
     */
    do(filenames) {
        vmscript.runInContext(createContext({ console, filenames }))
        .then(() => console.info(`Completed running '${scriptname}'. Waiting for file changes before restarting...\n`));
    }
});