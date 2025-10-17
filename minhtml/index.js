#!/usr/bin/env node

import { input, watch } from "./input.js";
import setCommand from "./command.js";
import log from "./log.js";
import { exec } from "child_process";
import fs from "fs";

/**
 * Map to store last modified times of input files.
 * @type {Map<string, string>}
 */
const mtimemap = new Map;

/**
 * Array of shell commands corresponding to each input file.
 * @type {string[]}
 */
const commands = input.map(setCommand);

/**
 * Iterate over each input file, run its command, and optionally watch for changes.
 */
input.forEach(async (path, index) => {
    /**
     * Checks the file's last modified time and executes the command if it has changed.
     * Recursively schedules itself when `watch` mode is enabled.
     */
    (function dowhile() {
        const mtime = fs.statSync(path).mtime.toString()
        // Skip execution if file hasn't changed
        if (mtimemap.get(path) == mtime)
            return watch && setTimeout(dowhile, 0);
        // Update last modified time
        mtimemap.set(path, mtime);
        // Execute the shell command for this file
        exec(commands[index], function() {
            log(...arguments);
            // Continue watching if enabled
            watch && setTimeout(dowhile, 0);
        });
    })();
});