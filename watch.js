/** 
 * @fileoverview
 * Entry script that parses command-line arguments for a root directory, 
 * ignore patterns, and a target script, then executes the target script 
 * while watching files according to the given patterns.
 */
import { execSync } from "child_process";
import { relative } from "path";
import fs from "fs";

const { root, ignoreList, script } = parseArgv(process.argv.slice(2));
execSync(`node ${writeWatchPathArgv(root, ignoreList)} "${script}"`, { stdio: "inherit" });

/**
 * Parse the command-line arguments to extract named parameters:
 * --root=<directory>   => root directory to watch
 * --ignore=<pattern>   => file/directory patterns to ignore
 * <script>             => the script to execute
 */
function parseArgv(argv) {
    const namedArgv = {
        root: ".",
        ignoreList: [],
        script: relative(".", argv.pop())
    }
    const ROOT_PATTERN = /^--root=/i;
    const IGNORE_PATTERN = /^--ignore=/i;
    // Iterate over remaining arguments to populate namedArgv
    argv.forEach(
        arg => 
            ROOT_PATTERN.test(arg)
                ? (namedArgv.root = arg.replace(ROOT_PATTERN, ""))
                : IGNORE_PATTERN.test(arg)
                    ? namedArgv.ignoreList.push(arg.replace(IGNORE_PATTERN, ""))
                    : null
    );
    // Convert root to a relative path
    namedArgv.root = relative(".", namedArgv.root);
    // Convert ignore patterns into glob-compatible patterns
    namedArgv.ignoreList.forEach((pattern, index, $this) => 
        $this[index] = "**/".concat(pattern, /[\/\\]$/i.test(pattern) ? "**/*" : "")
    );
    return namedArgv;
}

/**
 * Build a string of command-line arguments to pass watch paths to the child script.
 * Only includes actual files, excluding symbolic links.
 * @param {string} root - The root directory of the files to watch
 * @param {string[]} ignoreList - Glob patterns to exclude from watching
 * @returns {string} Concatenated --watch-path arguments for each file
 */
function writeWatchPathArgv(root, ignoreList) {
    // Append glob pattern for recursive matching to root directory
    return fs.globSync(root.concat("/**/*"), { exclude: ignoreList })
        .filter(file => fs.statSync(file).isFile() && !fs.statSync(file).isSymbolicLink())
        .map(file => '--watch-path="'.concat(file).concat('"'))
        .join(" ");
}