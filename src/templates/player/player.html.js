import { PLAYER_LOADING_CSS_CLASS } from "./player.css.js";
import { mapDOM } from "./player.dom.js";

export function updateSoundButton({ soundButton }, ytEmbedPlayer) {
    const isMuted = ytEmbedPlayer.isMuted();
    soundButton.ariaPressed = isMuted;
    isMuted ? ytEmbedPlayer.unMute() : ytEmbedPlayer.mute();
}

export function setLoadingState(ytPlayer, isLoading) {
    mapDOM(ytPlayer).thumbnail.classList.toggle(PLAYER_LOADING_CSS_CLASS, isLoading);
}