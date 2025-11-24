#!/usr/bin/env node

import bundleJS from "./bundle.js";
import minifyTemplates from "./minify_templates.js";
import path from "path";
const { relative, resolve } = path;

process.chdir(resolve(import.meta.dirname + "/.."));

function getRelative(pathLike) {
    return relative(resolve("."), pathLike);
}

await minifyTemplates(
    [import.meta.files ?? (await import("./all_templates.js")).default.files].flat(),
    { excludeExt: [ "js", "svg" ] }
)
.then(out => out.forEach(({ input, output }) => console.info(getRelative(input), "→", getRelative(output))))
.then(bundleJS);