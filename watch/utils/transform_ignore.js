/**
 * Normalize ignore patterns into glob-compatible patterns.
 * Normalization rules:
 * - Converts "foo" → "**\foo"
 * - If pattern ends with `/` or `\`, treat it as a directory:
 *   "dir/" → "**\dir\**\*"
 * @param {{ root: string|string[], ignore: string[]}} namedArgv
 * A list of raw ignore patterns to normalize. Will be mutated.
 */
export default function(namedArgv) {
    const ignoreList = [], includeList = [];
    
    namedArgv.ignore.forEach((pattern) => {
        const not = pattern.startsWith("!");
        not && (pattern = pattern.slice(1));
        pattern = "**/"
            .concat(pattern, /[\/\\]$/i.test(pattern) ? "**/*" : "")
            .replace(/^\*\*\/\*\*/, "**");
        const list = not ? includeList : ignoreList;
        list.push(pattern);
    });

    namedArgv.ignore = ignoreList;

    const root = includeList.map(pattern => namedArgv.root + "/" + pattern);
    root.length && (namedArgv.root = root);
}