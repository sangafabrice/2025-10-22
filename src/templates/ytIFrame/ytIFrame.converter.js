import ytIFrameApiReady from "./ytIFrame.api.ready.js";
import { dispatchOnReady, dispatchOnStateChange } from "./ytIFrame.event.js";

const ENCODED_BASE_URL = encodeURIComponent(window.location.origin);
const ENCODED_URL = encodeURIComponent(window.location.href);

export default class YoutubeIFrameConverter {
    constructor () {
        return YoutubeIFrameConverter;
    }

    static convert (iframe) {
        this.#setAttributes.apply(iframe, [iframe.dataset.src]);
        this.#setPlayer.apply(iframe);
    }

    static #setAttributes (videoId) {
        Object.assign(this, {
            allow: [
                "accelerometer",
                "autoplay",
                "clipboard-write",
                "encrypted-media",
                "gyroscope",
                "picture-in-picture"
            ].join("; "),
            referrerPolicy: "strict-origin-when-cross-origin",
            src: `https://www.youtube-nocookie.com/embed/${videoId}?` + Object.entries({
                playlist: videoId,
                playsinline: 1,
                controls: 0,
                mute: 0,
                loop: 1,
                modestbranding: 0,
                rel: 0,
                enablejsapi: 1,
                disablekb: 1,
                fs: 0,
                origin: ENCODED_BASE_URL,
                widget_referrer: ENCODED_URL
            }).map(entry => entry.join("=")).join("&")
        }).removeAttribute("data-src");
    }

    static async #setPlayer () {
        await ytIFrameApiReady &&
        new YT.Player(this, {
            events: {
                onReady: dispatchOnReady.bind(this),
                onStateChange: dispatchOnStateChange.bind(this)
            }
        });
    }
}