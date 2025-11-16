import { isCached, isFile, shouldSkip } from "./utils/skip_file.js";
import getDefaultOnComplete from "./utils/default_oncomplete_cb.js";
import { sep } from "path";
import { watch } from "fs/promises";
import { setTimeout } from "timers/promises";
import fs from "fs";

/**
 * @typedef {string[] & { test: (filename: string) => boolean }} IgnoreList
 */

export default Object.freeze(new class {
    /**
     * Configure the watcher.
     * @param {{ root: string, ignore: string[], delay: number, startup: { files?: string[] } }} options
     */
    config({ root, ignore, delay, startup : { files } }) {
        this.#root = root, this.#ignore = ignore, this.#delay = delay;
        this.#initTrackedFiles(files);
        return this;
    }

    /**
     * Start the restart loop.
     * @param {((files: string[]) => any | Promise<any>) & ({ path?: string })} callback
     * @param {(error: any) => any} [onerror]
     * @param {() => any} [oncomplete]
     */
    async onrestart(callback, onerror = console.error, oncomplete = getDefaultOnComplete(callback)) {
        for await (const files of this.#watch())
            try {
                await callback(files)?.catch(onerror);
            } catch (error) {
                onerror(error);
            } finally {
                oncomplete();
            }
    }

    /** @type {string} */ #root;
    /** @type {IgnoreList} */ #ignore;
    /** @type {Set<string>} */ #files;
    /** @type {number} */ #delay;
    /** @type {boolean} */ #startup = true;

    #initTrackedFiles(files) {
        files = (
            files
            ?? fs.globSync(`${this.#root}/**/*`, { exclude: this.#ignore })
        ).filter(isFile);
        files.forEach(isCached);
        this.#files = new Set(files);
    }

    async #trackFiles() {
        for await (let { eventType, filename } of watch(this.#root, { recursive: true })) {
            if (await shouldSkip(eventType, (filename = filename?.replace(/^/i, this.#root.concat(sep))), this.#ignore)) continue;
            this.#files.add(filename);
        }
    }

    #emitChangedFiles() {
        const changedFiles = [...this.#files];
        this.#startup = false;
        this.#files.clear();
        return changedFiles;
    }

    /**
     * Produces an array of changed file paths each time the watcher emits a batch.
     * @yield {string[]} Array of changed file paths.
     */
    async *#watch() {
        this.#trackFiles();
        while (true) {
            if (this.#files.size) yield setTimeout(this.#startup ? 0 : this.#delay)
                .then(this.#emitChangedFiles.bind(this));
            await setTimeout();
        }
    }
});