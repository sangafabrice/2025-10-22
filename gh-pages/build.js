import { execSync } from "child_process";
import { inlineSource } from "inline-source";
import { minify } from "html-minifier-terser";
import { load } from "cheerio";
import { chdir, cwd } from "process";
import fs from "fs";
import app from "./package.json" with { type: "json" };
import { MAIN_MIN_JS } from "./rollup.config.mjs";

// This command changes the current working directory to "src"
execSync("npx rollup --config", { cwd: import.meta.dirname });
execSync("npx postcss css/style.css -o css/bin/style.min.css");
execSync("npx html-minifier-terser --collapse-whitespace html/background.html -o public/html/background.html");
execSync("npx html-minifier-terser --collapse-whitespace html/hero.svg -o public/html/hero.svg");
fs.copyFile("js/component/fttl-progress-bar.min.js", "public/fttl-progress-bar.min.js", () => {});

const inHtml = fs.readFileSync("index.html", "utf8");
const $ = load(inHtml, { scriptingEnabled: false });
$(`[src="${app.main}"]`).attr("src", MAIN_MIN_JS);
$('[rel="icon"]').attr("href", "favicon.webp");
$('[is="component"]').attr("src", "fttl-progress-bar.min.js").removeAttr("is");
$('[is="jquery"]').attr("src", "https://code.jquery.com/jquery-3.7.1.min.js").removeAttr("is");
const domHtml = $.html({scriptingEnabled: false});
const outHtml = await inlineSource(domHtml, { rootpath: "." });
const minHtml = await minify(outHtml, { collapseWhitespace: true });
fs.writeFileSync("public/index.html", minHtml);