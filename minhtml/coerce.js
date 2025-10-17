import { globSync } from "fs";
import { matchesGlob } from "path";

/**
 * Converts a glob or array of globs to an array of HTML file paths.
 * Excludes files matching ignore patterns and includes only `.html` or `.htm` files.
 * @this yargs 
 * @param {string} glob - The input glob pattern or file path.
 * @returns {string[]} Array of resolved HTML file paths.
 */
export function coerceToHtmlPathArray(glob) {
    const { argv: { _, ignore, cwd } } = this.parsed;
    cwd && process.chdir(cwd);
    return globSync([glob].concat(_))
        .filter(file => !ignore.some(g => matchesGlob(file, g)) && matchesGlob(file, "**/*.{html,htm}"));
}

/**
 * Coerces an array of glob patterns for the `--ignore` option.
 * Ensures directory patterns match all nested files.
 * @param {string[]} glob - Array of ignore patterns from CLI.
 * @returns {string[]} Array of normalized ignore glob patterns.
 */
export function coerceIgnoreList(glob) {
    return glob.map(g => "**/".concat(g, /[\/\\]$/i.test(g) ? "**/*" : ""));
}