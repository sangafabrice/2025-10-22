import { updateSoundButton } from "./player.html.js";

function getOnMuteChangeHandler(ytEmbedPlayer) {
    return function (event) {
        event.stopPropagation();
        updateSoundButton({ soundButton: this }, ytEmbedPlayer);
    };
}

export default function registerOnMuteChangeListener(ytEmbedPlayer, { soundButton }) {
    const handler = getOnMuteChangeHandler(ytEmbedPlayer);
    soundButton.addEventListener("click", handler);
    soundButton.click();
    return handler;
}