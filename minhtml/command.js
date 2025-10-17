import { extname } from "path";
import { fileURLToPath } from "url";

/**
 * Path to the HTMLHint configuration file.
 * @type {string}
 */
const config = fileURLToPath(import.meta.resolve("./.htmlhintrc"));

/**
 * Generates a combined shell command to validate and minify a given HTML file.
 * The command string runs:
 * 1. `htmlhint` with the local configuration file.
 * 2. `html-minifier-terser` to collapse whitespace and output a `.min.html` file.
 * @param {string} htmlpath - Path to the input HTML file.
 * @returns {string} Shell command string that can be executed via `exec`.
 */
export default function(htmlpath) {
    const htmlext = extname(htmlpath);
    const output = htmlpath.slice(0, -htmlext.length).concat(".min").concat(htmlext);
    const hint = `npx htmlhint "${htmlpath}" --config "${config}"`;
    const terser = `npx html-minifier-terser "${htmlpath}" --output "${output}" --collapse-whitespace`;
    return hint + "&&" + terser;
}