const ROOT_PATTERN = /^--root=/i;
const IGNORE_PATTERN = /^--ignore=/i;
const DELAY_PATTERN = /^--delay=/i;

/**
 * Parse CLI arguments and populate the provided `namedArgv` object.
 * Recognized patterns:
 *   --root=<dir>
 *   --ignore=<pattern>
 *   --delay=<ms>
 * @param {string[]} cliargs - Raw CLI arguments (excluding the script path).
 * @param {{
 *   root: string,
 *   ignore: string[],
 *   delay: number
 * }} namedArgv - The target object to mutate with parsed values.
 */
export default function(cliargs, namedArgv) {
    cliargs.forEach(
        arg => 
            ROOT_PATTERN.test(arg)
                ? (namedArgv.root = arg.replace(ROOT_PATTERN, ""))
                : IGNORE_PATTERN.test(arg)
                    ? namedArgv.ignore.push(arg.replace(IGNORE_PATTERN, ""))
                    : DELAY_PATTERN.test(arg)
                        ? (namedArgv.delay = Number(arg.replace(DELAY_PATTERN, "")))
                        : null
    );
}