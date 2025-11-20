/**
 * Execute the provided script function with the list of changed filenames.
 * Ensures errors are logged and always prints a completion message.
 * @param {(files: string[]|undefined) => Promise<any>} script
 * A function to execute. Must expose a `.path` property for logging.
 * @param {string[]|undefined} filenames
 * The list of changed files (or `undefined` on initial startup).
 */
export default async function execCommand(script, filenames) {
    try {
        await script(filenames);
    } catch (error) {
        console.error(error);
    } finally {
        console.info(`Completed running '${script.path}'. Waiting for file changes before restarting...\n`);
    }
}