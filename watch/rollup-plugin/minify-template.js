/**
 * @fileoverview
 * Rollup plugin that minifies HTML and CSS files during the build process.
 * This plugin detects stylesheets and HTML files and applies a
 * minification function to their contents before bundling.
 */
import minify from "watch/minify";
import { basename, matchesGlob, extname } from "path";

const name = basename(import.meta.filename).slice(0, -".js".length);

/**
 * Creates a Rollup plugin that minifies HTML and CSS files.
 * @returns {import('rollup').Plugin}
 * A Rollup plugin object with a `transform` hook that minifies matching files.
 */
export default function minifyTemplate() {
    return {
        name,

        /**
         * Minifies HTML and CSS source files.
         * @param {string} code - The file’s raw source code.
         * @param {string} id - The resolved module ID (absolute file path).
         * @returns {{ code: string, map: { mappings: string } } | null}
         * Returns an object containing the minified code and a constant
         * empty source map, or `null` if the file should be skipped.
         */
        transform(code, id) {
            if (!matchesGlob(id, "**/*.{html,css}")) return null;
            return {
                code: minify(extname(id), code),
                map: { mappings: "" }
            };
        }
    };
}