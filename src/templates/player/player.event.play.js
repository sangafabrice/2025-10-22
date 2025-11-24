export function getOnTickHandler(ytPlayer, onTickCallback) {
    return function onTickHandler({ detail: ytEmbedPlayer }) {
        if (ytEmbedPlayer.videoId != ytPlayer.videoId) return;
        onTickCallback.apply(ytPlayer, [ytEmbedPlayer]);
        setTimeout(onTickHandler, 1000, ...arguments);
    }
}

export function shouldInitOnPlayStart(initPlayStateCallback, { detail: { isPlaying } }, handler) {
    if (!isPlaying) return;
    initPlayStateCallback.apply(this);
    this.removeEventListener("statechange", handler);
}

export function registerPlayControlListener(ytPlayer, ytEmbedPlayer, playCallback, pauseCallback) {
    ytPlayer.addEventListener("mouseenter", playCallback.bind(ytPlayer, ytEmbedPlayer));
    ytPlayer.addEventListener("mouseleave", pauseCallback.bind(ytPlayer, ytEmbedPlayer));
}