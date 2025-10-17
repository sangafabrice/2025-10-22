#!/usr/bin/env node

/** 
 * @fileoverview
 * Entry script that parses command-line arguments for a root directory, 
 * ignore patterns, and a target script, then executes the target script 
 * while watching files according to the given patterns.
 */
import cliargs from "./parse.js";
import onrestart from "./onrestart.js";
import { watch } from "fs";

// Start watching the root directory recursively
watch(cliargs.root, { recursive: true })
.on("change", onrestart.bind(null, cliargs))
.emit("change");