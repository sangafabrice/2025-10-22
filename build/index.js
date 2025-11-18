#!/usr/bin/env node

import { exec, execSync } from "child_process";
import { resolve } from "path";
import { argv, chdir } from "process";

chdir(resolve(import.meta.dirname + "/.."));
/\.css$/i.test(argv[2] ?? ".css") &&
execSync(
    "npx postcss *.css --dir bin --ext min.css --use postcss-preset-env --use cssnano --no-map",
    {stdio: "inherit", cwd: "src/templates/assets"}
);
exec(
    "npx rollup --config build/rollup.config.js",
    (exception, out, err) => {
        if (exception) throw exception;
        console.log(out, err);
    }
);