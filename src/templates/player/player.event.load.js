import { setLoadingState } from "./player.html.js";

const shouldPlayOnLoadMapper = Object.freeze(new WeakMap);

function setPlayOnLoad() {
    shouldPlayOnLoadMapper.set(this, true);
}

function unsetPlayOnLoad() {
    shouldPlayOnLoadMapper.set(this, false);
}

export function registerPlayOnLoadListener(ytPlayer) {
    setLoadingState(ytPlayer, true);
    ytPlayer.addEventListener("mouseenter", setPlayOnLoad);
    ytPlayer.addEventListener("mouseleave", unsetPlayOnLoad);
}

export function playOnLoad(ytPlayer, playCallback) {
    const shouldPlay = shouldPlayOnLoadMapper.get(ytPlayer);
    shouldPlay
        ? playCallback()
        : ytPlayer.addEventListener("mouseenter", playCallback, { once: true });
    shouldPlayOnLoadMapper.delete(ytPlayer);
    return shouldPlay;
}

function unregisterPlayOnLoadListener(ytPlayer) {
    setLoadingState(ytPlayer, false);
    shouldPlayOnLoadMapper.delete(ytPlayer);
    ytPlayer.removeEventListener("statechange", unregisterPlayOnLoadListener);
    ytPlayer.removeEventListener("mouseenter", setPlayOnLoad);
    ytPlayer.removeEventListener("mouseleave", unsetPlayOnLoad);
}

export function unregisterPlayOnLoadListenerOnLoadEnd({ detail: { isPlaying } }) {
    isPlaying && unregisterPlayOnLoadListener(this);
}