import { execSync } from "child_process";
import fs from "fs";
import path from "path";

fs.existsSync("public") || execSync("git worktree add public gh-pages");
mkJunction("app/dist", "./gh-pages/src/js/component");
mkJunction("public", "./gh-pages/src/public");

function mkJunction(relPath, dest) {
    fs.symlink(
        path.join(import.meta.dirname, relPath),
        dest,
        "junction",
        ()=>{}
    );
}