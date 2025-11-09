/**
 * @fileoverview
 * Parse the command-line arguments to extract named parameters:
 * --root=<directory>     => root directory to watch
 * --ignore=<pattern>     => file/directory patterns to ignore
 * --delay=<milliseconds> => time delay before triggering restart
 * <script>               => the script to execute
 */
import parseScript from "./utils/parse_script.js";
import transformIgnore from "./utils/transform_ignore.js";
import path from "path";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";

const DELAY_DEFAULT = 500;
const script = parseScript(process.argv.pop());
const namedArgv = yargs(hideBin(process.argv))
    .scriptName("watch")
    .option("root", {
        alias: "r",
        type: "string",
        nargs: 1,
        normalize: true,
        default: ".",
        coerce: path.relative.bind(path, ".")
    })
    .option("delay", {
        alias: "t",
        type: "number",
        nargs: 1,
        default: DELAY_DEFAULT,
        coerce: delay => delay > DELAY_DEFAULT ? delay : DELAY_DEFAULT
    })
    .option("ignore", {
        alias: "x",
        array: true,
        string: true,
        default: []
    })
    .parse();

transformIgnore(namedArgv);

const { root, ignore, delay } = namedArgv;
export default { root, ignore, delay, script };