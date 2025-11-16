import path from "path";

/**
 * Normalize ignore patterns into glob-compatible patterns and
 * augment the array with a `.test()` helper method.
 * Normalization rules:
 * - Converts "foo" → "**\foo"
 * - If pattern ends with `/` or `\`, treat it as a directory:
 *   "dir/" → "**\dir\**\*"
 * @param {Array<string> & { test: (filename: string) => boolean }} ignore
 * A list of raw ignore patterns to normalize. Will be mutated.
 */
export default function(ignore) {
    ignore.forEach((pattern, index, $this) => {
        const not = pattern.startsWith("!");
        not && (pattern = pattern.slice(1));
        $this[index] = (not ? "!":"") + "**/"
            .concat(pattern, /[\/\\]$/i.test(pattern) ? "**/*" : "")
            .replace(/^\*\*\/\*\*/, "**");
    });

    ignore.test = function (filename) {
        const matchesGlob = path.matchesGlob.bind(path, filename);
        return this.some(pattern => pattern.startsWith("!")
            ? !matchesGlob(pattern.slice(1))
            : matchesGlob(pattern));
    }
}