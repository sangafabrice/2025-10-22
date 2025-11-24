#!/usr/bin/env node

import bundleJS from "./bundle.js";
import minifyTemplates from "./minify_templates.js";
import startup from "./all_templates.js";
import { relative, resolve } from "path";

process.chdir(resolve(import.meta.dirname + "/.."));

function getRelative(pathLike) {
    return relative(resolve("."), pathLike);
}

export default function build(files = startup.files) {
    return minifyTemplates(files, { excludeExt: [ "js", "svg" ] })
    .then(out => out.forEach(({ input, output }) => console.info(getRelative(input), "→", getRelative(output))))
    .then(bundleJS);
}

if (import.meta.main) build();