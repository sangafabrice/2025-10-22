import { isCached, shouldSkip } from "./utils/skip_file.js";
import execCommand from "./exec.js";
import { setTimeout } from "timers/promises";
import { rollup, watch } from "rollup";

/**
 * @typedef {string[] & { test: (filename: string) => boolean }} IgnoreList
 */

export default Object.freeze(new class {
    /**
     * Configure the watcher.
     * @param {{ options: import("rollup").RollupWatchOptions[], delay: number }} options
     */
    config({ options, delay }) {
        this.#delay = delay;
        this.#setOptions(options);
        return this;
    }

    /**
     * Start the restart loop.
     * @param {string} script
     */
    onrestart(script) {
        const loggers = [...arguments].slice(1);
        execCommand.setScript(script)
        .then(async () => {
            for await (const files of this.#watch())
                await execCommand.do(files, ...loggers);
        });
        return this;
    }

    /**
     * Requests a restart of the current process.
     * This method can be used in two modes:
     * 1. **Registration mode** (`isRegistering === true`).
     * 2. **Execution mode** (`isRegistering === false`).
     * @param {boolean} isRegistering
     * If `true`, returns a callback bound to trigger a restart later.
     * If `false`, marks the instance to restart immediately.
     * @returns {Function|this} a bound function when registering,
     * or the instance itself when a restart is triggered.
     */
    restart(isRegistering) {
        if (isRegistering)
            return this.restart.bind(this, false);
        this.#restart = true;
        return this;
    }

    /** @type {Set<string>} */ #bundles = new Set;
    /** @type {import("rollup").RollupWatchOptions[]} */ #options;
    /** @type {number} */ #delay;
    /** @type {boolean} */ #restart = true;

    #setOptions(options) {
        this.#options = options.map(option =>
            Object.assign(option, { watch: { skipWrite: true, ...option.watch } })
        );
    }

    async #trackFiles() {
        this.#options.map(option =>
            watch(option).on("change", async (filename, { event }) => {
                if (event == "delete" || await shouldSkip(filename)) return;
                this.#bundles.add(option);
            })
        );
    }

    async #cacheFiles() {
        this.#options.map(option => rollup(option)
            .then(({ watchFiles }) => watchFiles.forEach(isCached))
            .catch(()=>{})
        );
    }

    #emitChangedFiles() {
        const changedBundles = this.#restart ? this.#options : [...this.#bundles];
        this.#bundles.clear();
        this.#restart = false;
        return changedBundles;
    }

    /**
     * Produces an array of changed file paths each time the watcher emits a batch.
     * @yield {string[]} Array of changed file paths.
     */
    async *#watch() {
        this.#trackFiles();
        this.#cacheFiles();
        while (true) {
            if (this.#restart || this.#bundles.size)
                yield setTimeout(this.#restart ? 0 : this.#delay)
                .then(this.#emitChangedFiles.bind(this));
            await setTimeout();
        }
    }
});