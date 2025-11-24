#!/usr/bin/env node

import bundleJS from "./bundle.js";
import minifyTemplates from "./minify_templates.js";
import path from "path";
const { relative, resolve } = path;
const { chdir, env } = process;

chdir(resolve(import.meta.dirname + "/.."));

function getRelative(pathLike) {
    return relative(resolve("."), pathLike);
}

await minifyTemplates(
    [(f => { if(f) return JSON.parse(f) })(env.FILENAME) ?? (await import("./all_templates.js")).default.files].flat(),
    { excludeExt: [ "js", "svg" ] }
)
.then(out => out.forEach(({ input, output }) => console.info(getRelative(input), "→", getRelative(output))))
.then(bundleJS);