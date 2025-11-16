#!/usr/bin/env node

import { globSync } from "fs";
import bundleJS from "./bundle.js";
import minifyTemplates from "./minify_templates.js";
import { relative, resolve } from "path";
import { chdir } from "process";

function getRelative(pathLike) {
    return relative(resolve("."), pathLike);
}

export { default as startup } from "./all_templates.js";

/**
 * Minify templates and bundle JS files.
 * @param {string[]} files - batch of watched files.
 * @returns {Promise<void>} Resolves once templates are minified and JS is bundled
 */
export default async function build(files) {
    return minifyTemplates(files)
        .then(out => out.forEach(({ input, output }) => console.info(getRelative(input), "→", getRelative(output))))
        .then(bundleJS);
}

if (import.meta.main) {
    chdir(resolve(import.meta.dirname + "/.."));
    build(globSync("src/**/*", { exclude: [ "**/bin/**/*" ] }));
}