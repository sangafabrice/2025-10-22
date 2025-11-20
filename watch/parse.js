/**
 * @fileoverview
 * Parse the command-line arguments to extract named parameters:
 * --root=<directory>     => root directory to watch
 * --ignore=<pattern>     => file/directory patterns to ignore
 * --delay=<milliseconds> => time delay before triggering restart
 * <script>               => the script to execute
 */
import path, { relative, matchesGlob, resolve } from "path";
import fs from "fs";
import { pathToFileURL } from "url";

const cliargs = process.argv.slice(2);

const namedArgv = {
    root: ".",
    ignoreList: [],
    delay: 500,
    /**
     * Resolves a script path, normalizes extensions and directories, and imports it.
     * @type {{script: ((files: string[]) => any) & ({path: string}), startup: { files: string[] }}}
     */
    ...await (async (scriptPath)  => {
        scriptPath =
            fs.existsSync(scriptPath) && fs.statSync(scriptPath).isDirectory()
                ? scriptPath.concat("/index.js")
                : matchesGlob(scriptPath, "**/*.js")
                    ? scriptPath : scriptPath.concat(".js");
        return import(pathToFileURL(resolve(scriptPath)).href)
            .then(({ default: script, startup }) => (
                {
                    script: Object.assign(script, { path: relative(".", scriptPath) }),
                    startup: startup ?? {}
                }
            ));
    })(cliargs.pop())
}
const ROOT_PATTERN = /^--root=/i;
const IGNORE_PATTERN = /^--ignore=/i;
const DELAY_PATTERN = /^--delay=/i;

// Iterate over remaining arguments to populate namedArgv
cliargs.forEach(
    arg => 
        ROOT_PATTERN.test(arg)
            ? (namedArgv.root = arg.replace(ROOT_PATTERN, ""))
            : IGNORE_PATTERN.test(arg)
                ? namedArgv.ignoreList.push(arg.replace(IGNORE_PATTERN, ""))
                : DELAY_PATTERN.test(arg)
                    ? (namedArgv.delay = Number(arg.replace(DELAY_PATTERN, "")))
                    : null
);

// Convert root to a relative path
namedArgv.root = relative(".", namedArgv.root);

// Convert ignore patterns into glob-compatible patterns
namedArgv.ignoreList.forEach((pattern, index, $this) => {
    const not = pattern.startsWith("!");
    not && (pattern = pattern.slice(1));
    $this[index] = (not ? "!":"") + "**/"
        .concat(pattern, /[\/\\]$/i.test(pattern) ? "**/*" : "")
        .replace(/^\*\*\/\*\*/, "**");
});

/**
 * Helper method added directly onto ignoreList array.
 * Tests whether a filename matches ANY ignore glob pattern.
 */
namedArgv.ignoreList.test = function (filename) {
    const matchesGlob = path.matchesGlob.bind(path, filename);
    return this.some(pattern => pattern.startsWith("!")
        ? !matchesGlob(pattern.slice(1))
        : matchesGlob(pattern));
}

export default namedArgv;