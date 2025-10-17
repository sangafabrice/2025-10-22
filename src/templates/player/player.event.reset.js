import { mapDOM, resetDOM } from "./player.dom.js";

export function registerOnVideoChangeListener(ytPlayer, ytEmbedPlayerDestroyFn, onMuteHandler) {
    const dom = mapDOM(ytPlayer);
    dom.derefiframe = function () {
        ytEmbedPlayerDestroyFn();
        dom.soundButton.removeEventListener("click", onMuteHandler);
        resetDOM(ytPlayer);
    };
}