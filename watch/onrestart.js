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
        nodemon({ watch, ignore, exec: "node -e \"\"", ext: "*" });
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
    /** @type {boolean} */ #restart = true;

    async #trackFiles() {
        nodemon.on("restart", async (filename) => {
            if (!filename) return this.#restart = true;
            if (await shouldSkip((filename = filename?.[0]))) return;
            this.#files.add(filename);
        });
    }

    #emitChangedFiles() {
        const changedFiles = this.#restart ? undefined : [...this.#files];
        this.#files.clear();
        this.#restart = false;
        return changedFiles;
    }

    /**
     * Produces an array of changed file paths each time the watcher emits a batch.
     * @yield {string[]} Array of changed file paths.
     */
    async *#watch() {
        this.#trackFiles();
        while (true) {
            if (this.#restart || this.#files.size)
                yield setTimeout(this.#restart ? 0 : this.#delay)
                .then(this.#emitChangedFiles.bind(this));
            await setTimeout();
        }
    }
});