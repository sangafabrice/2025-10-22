import { fork } from "child_process";

/**
 * Execute the target script using your project's "npm run node" command.
 * The optional {@link filenames} argument is passed through to the script,
 * quoted safely if present.  
 * @param {string} script - Path to the script that should be executed.
 * @param {string[]} [filenames] - Optional filenames passed to the script.
 */
export default function execCommand(script, filenames = []) {
    fork(script, filenames, { stdio: "inherit" })
    .on("exit", () => console.info(`Completed running '${script}'. Waiting for file changes before restarting...\n`));
}