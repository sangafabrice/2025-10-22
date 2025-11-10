import defaultOnComplete from "./utils/default_oncomplete_cb.js";
import { pathToFileURL } from "url";
import { resolve } from "path";

const DEFAULT_SCRIPT = "watch/restart";

/**
 * Module Runner Class
 * Loads a script using dynamic import.
 */
export default Object.freeze(new class {
    #modulefn; #script;

    /**
     * Sets the script to execute.
     * @param {string} pathLike - Path to the root script file.
     */
    async setScript(pathLike) {
        this.#script = pathLike ?? DEFAULT_SCRIPT;
        this.#modulefn = (await import(pathLike ? pathToFileURL(resolve(pathLike)) : DEFAULT_SCRIPT)).default;
    }

    /**
     * Executes the configured script file through a function call.
     * @param {string[] | undefined} filenames - Optional list of changed filenames.
     * @param {(error: any) => any} [onerror]
     * @param {() => any} [oncomplete]
     */
    async do(filenames, onerror = console.error, oncomplete = defaultOnComplete) {
        try {
            await this.#modulefn(filenames)?.catch(onerror);
        } catch (error) {
            onerror(error);
        } finally {
            oncomplete(this.#script);
        }
    }
});