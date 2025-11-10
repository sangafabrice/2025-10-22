import parseConfig from "./utils/parse_config.js";
import transformConfig from "./utils/transform_config.js";
import parseScript from "./utils/parse_script.js";
import transformIgnore from "./utils/transform_ignore.js";
import yargs from "yargs";

const DELAY_DEFAULT = 500;
const { config, ignore, delay, execute: script } = yargs(process.argv.slice(2))
    .scriptName("watch")
    .option("config", {
        alias: "c",
        type: "string",
        nargs: 1,
        normalize: true,
        default: ".",
        coerce: parseConfig
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
        default: [],
        coerce: transformIgnore
    })
    .option("execute", {
        alias: "e",
        type: "string",
        nargs: 1,
        normalize: true,
        coerce: parseScript
    })
    .parse();

export default { options: await transformConfig(config, ignore), delay, script };