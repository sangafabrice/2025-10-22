import { rollup } from "rollup";

/**
 * Builds all provided Rollup configuration options.
 * @param {import("rollup").RollupOptions[]} options Array of Rollup configuration objects.
 * @returns {Promise<void[]>} A promise that resolves once all configurations have been built.
 */
export default function(options) {
    return Promise.all(options.map(option => rollup(option).then(bundle => {
        const { input, output } = option;
        const out = [output].flat();
        out.map(bundle.write);
        console.info(input, "→", out.map(({ file }) => file));
    })));
}