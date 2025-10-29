import minify from "minify";
import { statSync } from "fs";
import fs from "fs/promises";

import path from "path";

/**
 * Remove templates whose extensions should be excluded from processing.
 * @param {string[]} templates - List of template file paths.
 * @param {string[]} extensions - Extensions to exclude (e.g., ["js"]).
 * @returns {string[]} Filtered list of templates to process.
 */
function exclude(templates, extensions) {
    return templates.filter(template =>
        (stat => stat.isFile() && !stat.isSymbolicLink())(statSync(template)) &&
        !path.matchesGlob(template, `**/*.{${extensions.concat(extensions.at(-1)).join(",")}}`)
    );
}

/**
 * Minify a single template file.
 * The minified file is written into a `bin/` directory located next to the original file.
 * Returns an object describing the input and output paths.
 * @param {string} template - Path to the template file.
 * @returns {Promise<{ input: string, output: string }|undefined>}
 */
async function minifyTemplate(template) {
    const outDir = path.join(path.dirname(template), "bin");
    const minTemplateFile = path.join(outDir, path.basename(template).replace(/(\.[^\.]+)$/g, ".min$1"));
    return fs.mkdir(outDir, { recursive: true })
        .then(() => fs.readFile(template, { encoding: "utf8" }))
        .then(minify.bind(null, path.extname(template)))
        .then(fs.writeFile.bind(fs, minTemplateFile))
        .then(() => ({ input: template, output: minTemplateFile }))
        .catch(() => undefined);
}

/**
 * Minify a list of templates, skipping any whose extensions are excluded.
 * @param {string[]} templates - List of files to minify.
 * @param {{ excludeExt: string[] }} [option={ excludeExt: ["js"] }] - Options.
 * @returns {Promise<Array<{ input: string, output: string }>>}
 */
export default function minifyTemplates(templates, option = { excludeExt: [ "js" ] }) {
    const minifiers = [];
    minifiers.push(exclude(templates, option.excludeExt).map(minifyTemplate));
    return Promise.allSettled(...minifiers)
        .then(states => states.map(({ value }) => value).filter(Boolean));
}