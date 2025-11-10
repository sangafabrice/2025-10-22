/**
 * Normalize ignore patterns into glob-compatible patterns.
 * Normalization rules:
 * - Converts "foo" → "**\foo"
 * - If pattern ends with `/` or `\`, treat it as a directory:
 *   "dir/" → "**\dir\**\*"
 * @param {string[]} ignore
 * A list of raw ignore patterns to normalize. Will be mutated.
 */
export default function(ignore) {
    const ignoreList = [], includeList = [];
    
    ignore.forEach((pattern) => {
        const not = pattern.startsWith("!");
        not && (pattern = pattern.slice(1));
        pattern = "**/"
            .concat(pattern, /[\/\\]$/i.test(pattern) ? "**/*" : "")
            .replace(/^\*\*\/\*\*/, "**");
        const list = not ? includeList : ignoreList;
        list.push(pattern);
    });

    return { exclude: ignoreList, include: includeList };
}