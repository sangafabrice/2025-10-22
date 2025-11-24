/**
 * Logger that prints a completion message after a script finishes.
 * @param {string} script The script path of the function that was executed.
 */
export default function(script) {
    console.info(`Completed running '${script}'. Waiting for file changes before restarting...\n`);
}