import { loadConfigFile } from "rollup/loadConfigFile";
import { resolve } from "path";

/**
 * Loads and prepares Rollup configuration options from a config file.
 * Uses Rollup’s `loadConfigFile()` to interpret `.js`, `.mjs`, `.cjs` config files.
 * After loading, this function optionally injects a `watch` configuration
 * into each returned Rollup option object.
 * @param {string} config Path to the Rollup configuration file.  
 * @param {object} [watch] Value assigned to `option.watch`.  
 * @returns {Promise<import("rollup").RollupOptions[]>} A promise resolving to an array
 * of Rollup options objects ready to pass to `rollup()` or `watch()`.
 */
export default async function(config, watch) {
    const { options } = await loadConfigFile(resolve(config));
    options.forEach(option => Object.assign(option, { watch }));
    return options;
}