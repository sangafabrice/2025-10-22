import { SourceTextModule, createContext } from "vm";
import { readFileSync } from "fs";
import { pathToFileURL } from "url";
import { dirname, join, resolve } from "path";

let scriptname, scriptfullname, scriptdir, scriptdir_join;

/**
 * Dynamically resolves and imports modules for SourceTextModule.
 * Handles both bare specifiers (e.g., "fs") and relative imports
 * by rewriting them relative to the directory containing the root script.
 * @param {string} specifier - The module specifier appearing in `import`.
 * @returns {Promise<any>} Promise resolving to the imported module namespace.
 */
async function importModuleDynamically(specifier) {
    return import(/^\.{1,2}\//.test(specifier) ? scriptdir_join(specifier) : specifier);
}

/**
 * Initializes custom fields on an `import.meta`.
 * @param {string[] | undefined} filenames - Optional list of changed filenames.
 * @param {object} meta - The import meta object to extend.
 * @param {string} meta.dirname - Injected by this function. Directory of the current module file.
 * @param {string} meta.filename - Injected by this function. Absolute path to the module file.
 * @param {string} meta.url - Injected by this function. File URL pointing to the current module.
 * @param {function(string): string} meta.resolve - A bound version of `import.meta.resolve`
 */
function initialize_import_meta(filenames, meta) {
    meta.dirname = scriptdir;
    meta.filename = scriptfullname;
    meta.url = pathToFileURL(scriptfullname).href;
    meta.resolve = import.meta.resolve.bind(meta);
    meta.files = filenames;
}

/**
 * Recursively links all dependency modules requested by the provided module.
 * @param {SourceTextModule} module - Module whose dependencies will be resolved.
 * @param {Map<string, SourceTextModule>} [moduleMap] - Cache mapping specifiers to module instances.
 */
function linkResolveDependencies(module, moduleMap) {
    moduleMap = moduleMap ?? new Map;
    // Link each import request from the module
    module.linkRequests(module.moduleRequests.map(request => {
        const specifier = request.specifier;
        // Reuse or create a new module instance for the specifier
        let requestedModule = moduleMap.get(specifier);
        if (requestedModule === undefined) {
            requestedModule = new SourceTextModule(
                // Wrap import so namespace.default works correctly
                `const imp = await import("${specifier}");` +
                "export default imp?.default ?? imp;",
                { importModuleDynamically }
            );
            moduleMap.set(specifier, requestedModule);
            // Recursively process dependencies
            linkResolveDependencies(requestedModule, moduleMap);
        }
        return requestedModule;
    }));
}

/**
 * Module Runner Class
 * Loads a script using `vm.SourceTextModule`, automatically resolves
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
        scriptfullname = resolve(pathLike);
        scriptdir = dirname(scriptfullname);
        scriptdir_join = (specifier) => pathToFileURL(join(scriptdir, specifier));
    }

    /**
     * Executes the configured script file through a new SourceTextModule.
     * @param {string[] | undefined} filenames - Optional list of changed filenames.
     */
    do(filenames) {
        const initializeImportMeta = initialize_import_meta.bind(null, filenames);
        const build = new SourceTextModule(
            readFileSync(scriptname, { encoding: "utf8" }),
            { importModuleDynamically, initializeImportMeta }
        );
        linkResolveDependencies(build);
        build.instantiate();
        build.evaluate()
        .then(() => console.info(`Completed running '${scriptname}'. Waiting for file changes before restarting...\n`));
    }
});