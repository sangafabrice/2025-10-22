export default function(exception, message, error) {
    exception && console.error(exception);
    console.log(message.trim(), ":", error.trim());
}