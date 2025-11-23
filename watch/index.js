#!/usr/bin/env node

/** 
 * @fileoverview
 * Entry script that parses command-line arguments for a root directory, 
 * ignore patterns, and a target script, then executes the target script 
 * while watching files according to the given patterns.
 */
import cliargs from "./parse.js";
import execCommand from "./exec.js";
import nodemon from "nodemon";

const { root: watch, ignore, script } = cliargs;

nodemon({ watch, ignore })
.on("restart", execCommand.bind(null, script))
.restart();