const eventDefaultSettings = { bubbles: true, composed: true };

export function dispatchOnReady ({ target: player }) {
    this.dispatchEvent(new CustomEvent("ready", {
        ...eventDefaultSettings,
        detail: {
            destroy: player.destroy.bind(player),
            duration: player.getDuration(),
            seekTo: player.seekTo.bind(player),
            playVideo: player.playVideo.bind(player),
            pauseVideo: player.pauseVideo.bind(player),
            mute: player.setVolume.bind(player, 0),
            unMute: player.setVolume.bind(player, 100),
            isMuted: () => player.getVolume() === 0,
            href: player.getVideoUrl(),
            title: player.videoTitle
        }
    }));
}

export function dispatchOnStateChange ({ target: player, data }) {
    this.dispatchEvent(new CustomEvent("statechange", {
        ...eventDefaultSettings,
        detail: {
            videoId: player.getVideoData().video_id,
            playVideo: player.playVideo.bind(player),
            getCurrentTime: player.getCurrentTime.bind(player),
            isPlaying: data == YT.PlayerState.PLAYING,
            getVideoBytesLoaded: player.getVideoBytesLoaded.bind(player)
        }
    }));
}