#!/usr/bin/env node

import bundleJS from "./bundle.js";
import minifyTemplates from "./minify_templates.js";
import startup from "./all_templates.js";
import { basename, dirname, matchesGlob, relative, resolve, sep } from "path";

process.chdir(resolve(import.meta.dirname + "/.."));

function getRelative(pathLike) {
    return relative(resolve("."), pathLike);
}

export default function build(files) {
    return minifyTemplates(files ?? startup.files, { excludeExt: [ "js", "svg" ] })
    .then(out => out.forEach(({ input, output }) => console.info(getRelative(input), "→", getRelative(output))))
    .then(() => bundleJS(files
        ?.filter(file => matchesGlob(file, "**/*.{html,css}"))
        .map(file => resolve(relative(".", dirname(file) + sep + "bin" + sep + basename(file).replace(/\.(css|html)/i, ".min.$1"))))
    ));
}

if (import.meta.main) build();