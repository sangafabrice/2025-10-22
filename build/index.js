import { exec, execSync } from "child_process";

execSync("npm run build:css", {stdio: "inherit"});
exec("npm run build:js", (exception, out, err) => {
    if (exception) throw exception;
    console.log(out, err);
});