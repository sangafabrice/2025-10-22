/**
 * @fileoverview
 * Parse the command-line arguments to extract named parameters:
 * --root=<directory>     => root directory to watch
 * --ignore=<pattern>     => file/directory patterns to ignore
 * --delay=<milliseconds> => time delay before triggering restart
 * <script>               => the script to execute
 */
import parseScript from "./utils/parse_script.js";
import parseFlags from "./utils/parse_flags.js";
import transformIgnore from "./utils/transform_ignore.js";
import { relative } from "path";

/**
 * @typedef {Object} NamedArgv
 * @property {string} root Root directory to watch
 * @property {string[]} ignore Array of ignore patterns (glob-like)
 * @property {number} delay Debounce delay in ms
 * @property {string} script
 */

const cliargs = process.argv.slice(2);

// Base settings before flag parsing.
const namedArgv = {
    root: ".",
    ignore: [],
    delay: 500,
    script: parseScript(cliargs.pop())
}

// Parse flags (--root, --ignore, --delay)
parseFlags(cliargs, namedArgv)

// Normalize root to a relative path
namedArgv.root = relative(".", namedArgv.root);

// Transform ignore patterns into glob-compatible ones
transformIgnore(namedArgv);

export default namedArgv;