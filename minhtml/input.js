/**
 * Entry point for the `minhtml` CLI tool.
 * Parses command-line arguments for HTML validation and minification.
 */
import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import { coerceIgnoreList, coerceToHtmlPathArray } from "./coerce.js";

/**
 * Parsed command-line arguments.
 * @typedef {Object} CliArgs
 * @property {string[]} input - Array of HTML file paths to validate/minify.
 * @property {boolean} [watch] - Whether to watch files for changes.
 * @property {string[]} [ignore] - Array of glob patterns to ignore.
 * @property {string} [cwd] - Current working directory to operate from.
 */

/**
 * Parses command-line arguments using yargs.
 * Supports `<input>` positional argument and options `--ignore`, `--cwd`, `--watch`.
 * @type {CliArgs}
 */
export const { input, watch } = yargs(hideBin(process.argv))
    .scriptName("minhtml")
    .command(
        "$0 <input>", 
        "validate and minify html files",
        yargs => yargs.positional('input', { type: 'string', coerce: coerceToHtmlPathArray.bind(yargs) })
    )
    .option("ignore", { array: true, string: true, coerce: coerceIgnoreList })
    .option("cwd", { type: "string" })
    .option("watch", { type: "boolean" })
    .parse();