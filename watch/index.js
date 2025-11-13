#!/usr/bin/env node

/** 
 * @fileoverview
 * Entry script that parses command-line arguments for a root directory, 
 * ignore patterns, and a target script, then executes the target script 
 * while watching files according to the given patterns.
 */
import cliargs from "./parse.js";
import watcher from "./onrestart.js";

watcher.config(cliargs).onrestart(cliargs.script);