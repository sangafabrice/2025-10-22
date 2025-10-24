#!/usr/bin/env node

import { exec } from "child_process";

const filenames = process.argv.slice(2);

/**
 * Checks whether any of the provided filenames end with the given extension.
 * If no filenames are passed, returns `true` (build all by default).
 * @param {string} ext - File extension to test (without dot).
 * @returns {boolean} `true` if at least one file has the given extension, or if none were passed.
 */
const testExt = ext => filenames.length ? filenames.some(name => name.endsWith("." + ext)) : true;

/**
 * Executes an npm build script for the given extension.
 * @param {string} ext - The build target suffix (e.g., "css", "html", "js").
 * @param {Function} [cb=stdio.bind(null, ...new Array(2).fill(undefined))] - Optional callback for exec output.
 */
const runExt = (ext, cb = stdio.bind(null, ...new Array(2).fill(undefined))) => exec("npm run build:" + ext, cb);

/**
 * Executes the build script for the given extension **only if**
 * the file list includes that extension (or none were specified).
 * Returns a promise that resolves when the command completes.
 * @param {string} ext - The extension to check and build.
 * @returns {Promise<void | []>} A promise resolving after the build completes or immediately if skipped.
 */
const extExec = ext => testExt(ext)
    ? new Promise(function () { runExt(ext, stdio.bind(null, ...arguments)) })
    : Promise.resolve([]);

// Run build tasks:
// - CSS, HTML and SVG builds run in parallel (if applicable).
// - JS build runs afterward unconditionally.
await Promise.all([ extExec("css"), extExec("html"), extExec("svg") ].flat());
runExt("js");

/**
 * Standardized callback for handling `exec` output and promise resolution.
 * - Logs stdout and stderr.
 * - Rejects on error, throwing the exception.
 * @param {Function} [resolve] - Promise resolver.
 * @param {Function} [reject] - Promise rejector.
 * @param {Error} [exception] - Exception if the child process fails.
 * @param {string} [out] - Standard output.
 * @param {string} [err] - Standard error.
 */
function stdio(resolve, reject, exception, out, err) {
    if (exception) {
        reject?.(exception);
        throw exception;
    }
    console.log(out, err);
    resolve?.();
}