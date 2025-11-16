/**
 * Returns a logger function that prints a completion message after a script finishes.
 * @function default
 * @param {Function & { path?: string }} callback
 * The script function that was executed.
 * The function may optionally have a `.path` property indicating its file path.
 */
export default function(callback) {
    return console.info.bind(
        console, 
        `Completed running '${callback?.path}'. Waiting for file changes before restarting...\n`
    );
}