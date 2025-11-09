import { resolve } from "path";
import { globSync } from "fs";

export default {
    files: globSync(
        [
            "shadow.css",
            "template.html",
            "*.svg"
        ].map(scriptName => "**/assets/" + scriptName)
    ).map(template => resolve(template))
};