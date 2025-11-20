import { loadConfigFile } from "rollup/loadConfigFile";
import { rollup } from "rollup";
import { fileURLToPath } from "url";

/**
 * Bundles JavaScript files using Rollup based on the project's `rollup.config.js`.
 */
export default async function bundleJS() {
    const { options: { "0": option } } = await loadConfigFile(fileURLToPath(import.meta.resolve("./rollup.config.js")));
    const { input, output } = option;
    output.map((await rollup(option)).write);
    return console.info(input, "→", output.map(({ file }) => file));
}