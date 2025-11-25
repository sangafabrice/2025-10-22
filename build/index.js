#!/usr/bin/env node

(async() => {
const bundleJS = (await import("./bundle.js")).default;
const minifyTemplates = (await import("./minify_templates.js")).default;
const importMeta = (await import("./meta.js")).default;
const { dirname, relative, resolve } = await import("path");
const { chdir, env, cwd, argv } = await import("process");

chdir(resolve(importMeta.dirname + "/.."));

function getRelative(pathLike) {
    return relative(resolve("."), pathLike);
}

let files
try { files = filenames; } catch (error) { }

await minifyTemplates(
    [files ?? (await import("./all_templates.js")).default.files].flat(),
    { excludeExt: [ "js", "svg" ] }
)
.then(out => out.forEach(({ input, output }) => console.info(getRelative(input), "→", getRelative(output))))
.then(bundleJS);
})();