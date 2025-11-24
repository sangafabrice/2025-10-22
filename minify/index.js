/**
 * @fileoverview
 * Lightweight wrapper around CSS/HTML/JS/SVG minifiers.
 */
import postcss from "postcss";
import presetEnv from "postcss-preset-env";
import cssnano from "cssnano";
import { minify } from "html-minifier-terser";
import { minify as minify_js } from "terser";
import { optimize } from "svgo";
import { HTMLHint } from "htmlhint";
import ruleset from "./htmlhint.json" with { type: "json" };


// Preconfigured PostCSS processor
const pcssproc = postcss([presetEnv, cssnano]);

function minifyHTML(content) {
    const hints = HTMLHint.verify(content, ruleset);
    if (hints.length) throw new Error(hints);
    return minify(content, { collapseWhitespace: true });
}

/**
 * Minify file content based on its extension.
 * @param {string} extname  - The file extension (e.g., ".css", ".js", ".svg", ".html").
 * @param {string} content  - Raw file content to minify.
 * @returns {Promise<string>} Resolves to the minified content
 */
export default async function(extname, content) {
    switch (extname) {
        case ".css": return pcssproc.process(content).async().then(({ css }) => css);
        case ".svg": return optimize(content, { multipass: true }).data;
        case ".html": return minifyHTML(content);
        case ".js": return minify_js(content).then(({ code }) => code);
    }
    return content; // Default: no minification
}