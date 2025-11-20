#!/usr/bin/env node

import bundleJS from "./bundle.js";
import minifyTemplates from "./minify_templates.js";
import { relative, resolve } from "path";

function getRelative(pathLike) {
    return relative(resolve("."), pathLike);
}

/**
 * Build pipeline:
 * @param {string|string[]|undefined} files
 * List of template files to process.
 * If omitted, all templates from `all_templates.js` are used.
 */
export default async function build(files) {
    return minifyTemplates([files ?? (await import("./all_templates.js")).default].flat())
        .then(out => out.forEach(({ input, output }) => console.info(getRelative(input), "→", getRelative(output))))
        .then(bundleJS);
}

if (import.meta.main) build(); 