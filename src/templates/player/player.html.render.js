import getVideoUrl from "../../utils/videoUrl.util.js";
import { mapDOM, renderDOM } from "./player.dom.js";

function renderVideoId({ videoId }, { anchor, ytiframe: { dataset }, thumbnail }) {
    return Object.freeze(new URL((anchor.href = getVideoUrl(Object.assign(thumbnail, { videoId: (dataset.src = videoId) })))));
}

function lockVideoId(ytPlayer) {
    Object.defineProperty(ytPlayer, "videoId", {
        value: ytPlayer.videoId,
        writable: false,
        configurable: false,
        enumerable: false,
    });
}

export function renderTitle(ytPlayer, { title }, { anchor }) {
    anchor.innerText = `Watch "${Object.assign(ytPlayer, { title }).title}" on Youtube`;
}

export function render(ytPlayer, callback) {
    renderDOM(ytPlayer);
    callback(renderVideoId(ytPlayer, mapDOM(ytPlayer)));
}