import { execSync } from "child_process";

/**
 * Execute the target script using your project's "npm run node" command.
 * The optional {@link filename} argument is passed through to the script,
 * quoted safely if present.  
 * @param {string} script - Path to the script that should be executed.
 * @param {string} [filename] - Optional filename passed to the script.
 */
export default function execCommand(script, filename) {
    try {
        execSync(`npm run node -- "${script}"  ${filename?.replace(/^(.)/, '"$1').concat('"') ?? ""}`, { stdio: "inherit" });
    } catch (error) { }
    console.info(`Completed running '${script}'. Waiting for file changes before restarting...\n`);
}