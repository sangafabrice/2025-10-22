/**
 * @fileoverview
 * Parse the command-line arguments to extract named parameters:
 * --root=<directory>   => root directory to watch
 * --ignore=<pattern>   => file/directory patterns to ignore
 * <script>             => the script to execute
 */
import { relative, matchesGlob } from "path";
import { argv } from "process";

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

/**
 * Helper method added directly onto ignoreList array.
 * Tests whether a filename matches ANY ignore glob pattern.
 */
namedArgv.ignoreList.test = function (filename) {
    return this.some(pattern => matchesGlob(filename, pattern));
}

export default namedArgv;