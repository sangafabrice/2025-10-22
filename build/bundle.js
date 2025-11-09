import options from "./rollup.config.js";
import { rollup, watch } from "rollup";
import { matchesGlob, relative } from "path";

/**
 * Starts Rollup watchers for all configuration entries.
 */
function startWatch() {
    startWatch.flag = true;
    options
    .map(option => watch(Object.assign(option, { watch: { exclude: "**/*.min.*" } })))
    .forEach(watcher => watcher.on("event", ({ code, input, output }) => {
        if (code != "BUNDLE_END") return;
        console.info(input, "→", output.map(bundle => relative(".", bundle)));
    }));
}

/**
 * Bundles JavaScript files using Rollup based on the project's `rollup.config.js`.
 */
export default function bundleJS(files) {
    startWatch.flag ?? startWatch();
    if (!files) return;
    return Promise.all(
        options.map(async (option) => {
            const { input, output } = option;
            const rollupOption = await rollup(option);
            const watchfiles = rollupOption.watchFiles
                .filter(file => matchesGlob(file, "**/*.{html,css}"));
            const filesSet = new Set(files);
            if (!watchfiles.some(wfiles => filesSet.has(wfiles))) return;
            output.map(rollupOption.write);
            console.info(input, "→", output.map(({ file }) => file));
        })
    );
}