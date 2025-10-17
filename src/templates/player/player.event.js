import { mapDOM } from "./player.dom.js";
import { playOnLoad, unregisterPlayOnLoadListenerOnLoadEnd } from "./player.event.load.js";
import registerOnMuteChangeListener from "./player.event.mutestate.js";
import { getOnTickHandler, registerPlayControlListener, shouldInitOnPlayStart } from "./player.event.play.js";
import { registerOnVideoChangeListener } from "./player.event.reset.js";
import { renderTitle } from "./player.html.render.js";
import { renderDuration } from "./player.html.time.js";

export function registerOnPlayStartListener(ytPlayer, initPlayStateCallback, onTickCallback) {
    ytPlayer.addEventListener("statechange", getOnTickHandler(ytPlayer, onTickCallback), { once: true });
    ytPlayer.addEventListener("statechange", unregisterPlayOnLoadListenerOnLoadEnd);
    const handler = event => shouldInitOnPlayStart.apply(ytPlayer, [initPlayStateCallback, event, handler]);
    ytPlayer.addEventListener("statechange", handler);
}

export function registerOnReadyListener(ytPlayer, setDurationPropCallback, playCallback, pauseCallback) {
    ytPlayer.addEventListener(
        "ready",
        function ({ detail: ytEmbedPlayer }) {
            playOnLoad(this, ytEmbedPlayer.playVideo);
            renderTitle(this, ytEmbedPlayer, mapDOM(this));
            renderDuration(ytEmbedPlayer, mapDOM(this), setDurationPropCallback);
            const onMuteHandler = registerOnMuteChangeListener(ytEmbedPlayer, mapDOM(this));
            registerPlayControlListener(this, ytEmbedPlayer, playCallback, pauseCallback);
            registerOnVideoChangeListener(this, ytEmbedPlayer.destroy, onMuteHandler);
        },
        { once: true }
    );
}