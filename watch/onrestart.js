import { shouldSkip } from "./utils/skip_file.js";
import execCommand from "./exec.js";
import { setTimeout } from "timers/promises";
import nodemon from "nodemon";

/**
 * @typedef {string[] & { test: (filename: string) => boolean }} IgnoreList
 */

export default Object.freeze(new class {
    /**
     * Configure the watcher.
     * @param {{ root: string, ignore: string[], delay: number }} options
     */
    config({ root: watch, ignore, delay }) {
        this.#delay = delay;
        nodemon({ watch, ignore });
        return this;
    }

    /**
     * Start the restart loop.
     * @param {string} script
     */
    async onrestart(script) {
        await execCommand.setScript(script);
        const loggers = [...arguments].slice(1);
        for await (const files of this.#watch())
            await execCommand.do(files, ...loggers);
    }

    /** @type {Set<string>} */ #files = new Set;
    /** @type {number} */ #delay;

    async #trackFiles() {
        nodemon.on("restart", async ({ "0": filename }) => {
            if (await shouldSkip(filename)) return;
            this.#files.add(filename);
        });
    }

    #emitChangedFiles() {
        const changedFiles = [...this.#files];
        this.#files.clear();
        return changedFiles;
    }

    /**
     * Produces an array of changed file paths each time the watcher emits a batch.
     * @yield {string[]} Array of changed file paths.
     */
    async *#watch() {
        this.#trackFiles();
        yield undefined;
        while (true) {
            if (this.#files.size) yield setTimeout(this.#delay)
                .then(this.#emitChangedFiles.bind(this));
            await setTimeout();
        }
    }
});