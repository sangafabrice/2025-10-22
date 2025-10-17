#!/usr/bin/env node

import { exec, execSync } from "child_process";

/\.css$/i.test(process.argv[2] ?? ".css") &&
execSync("npm run build:css", {stdio: "inherit"});
exec("npm run build:js", (exception, out, err) => {
    if (exception) throw exception;
    console.log(out, err);
});