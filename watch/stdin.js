const stdin = process.stdin.setEncoding('utf8').setRawMode(false).resume();

/**
 * Registers a keyboard command on standard input and triggers a callback
 * when the user types the specified command followed by Enter.
 * @param {string} command The text command to listen for (case-insensitive).
 * @param {Function} restartCb The function to call when the command is matched.
 */
export default function(command, restartCb) {
    stdin.on("data", data => data.trim().toLowerCase() == command && restartCb());
}