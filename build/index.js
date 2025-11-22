#!/usr/bin/env node

import bundleJS from "./bundle.js";
import minifyTemplates from "./minify_templates.js";
import { relative, resolve } from "path";
import { chdir, env } from "process";

chdir(resolve(import.meta.dirname + "/.."));

function getRelative(pathLike) {
    return relative(resolve("."), pathLike);
}

minifyTemplates(
    [env.FILENAME ?? (await import("./all_templates.js")).default.files].flat(),
    { excludeExt: [ "js", "svg" ] }
)
.then(out => out.forEach(({ input, output }) => console.info(getRelative(input), "→", getRelative(output))))
.then(bundleJS);