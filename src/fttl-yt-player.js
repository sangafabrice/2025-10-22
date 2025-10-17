import style from "./templates/player/player.css.js";
import { mapDOM, unmapDOM } from "./templates/player/player.dom.js";
import { registerOnPlayStartListener, registerOnReadyListener } from "./templates/player/player.event.js";
import { registerPlayOnLoadListener } from "./templates/player/player.event.load.js";
import { render } from "./templates/player/player.html.render.js";
import { renderCurrentTime } from "./templates/player/player.html.time.js";
import { reflectAttribute } from "./utils/reflection.util.js";
import { httpTestVideoId } from "./utils/videoIdValidation.http.js";

const VIDEO_ID_ATTR_NAME = "video-id";
const YT_ELEMENT_NAME = "fttl-yt-player";

class YoutubePlayer extends HTMLElement {
    #href; #duration; #currentTime; #isPlaying; #isMuted; #isRendered = false;

    get videoTitle() {
        return mapDOM(this).ytiframe.title;
    }

    get href() {
        return this.#href.toString();
    }

    constructor() {
        super();
        this.attachShadow({ mode: "open" });
        reflectAttribute(this, VIDEO_ID_ATTR_NAME);
        this.#resetState();
    }

    connectedCallback() {
        registerPlayOnLoadListener(this);
        style(this);
    }

    async attributeChangedCallback(_, oldId, videoId) {
        if (oldId == videoId || !(await httpTestVideoId(videoId))) return;
        if (this.#isRendered) {
            this.#resetState();
            registerPlayOnLoadListener(this);
        }
        render(this, url => this.#href = url);
        this.#isRendered = true;
    }

    static get observedAttributes() {
        return [VIDEO_ID_ATTR_NAME];
    }

    disconnectedCallback() {
        unmapDOM(this);
    }

    #resetState() {
        this.#href = null;
        this.#duration = 0;
        this.#currentTime = 0;
        this.#isPlaying = false;
        this.#isMuted = true;
        registerOnPlayStartListener(
            this,
            () => this.#isPlaying = true,
            this.#setCurrentTimeOnTick
        );
        registerOnReadyListener(
            this,
            duration => this.#duration = duration,
            this.#seekOnPlay,
            this.#muteOnPause
        );
        mapDOM(this)?.derefiframe?.();
    }

    #seekOnPlay(ytEmbedPlayer) {
        !this.#isMuted && ytEmbedPlayer.unMute();
        ytEmbedPlayer.seekTo(this.#currentTime, true);
        ytEmbedPlayer.playVideo();
        this.#isPlaying = true;
    }

    #muteOnPause(ytEmbedPlayer) {
        this.#isPlaying = false;
        this.#isMuted = ytEmbedPlayer.isMuted();
        ytEmbedPlayer.mute();
    }

    #setCurrentTimeOnTick(ytEmbedPlayer) {
        this.#isPlaying &&
        renderCurrentTime(
            this,
            this.#href,
            (this.#currentTime = ytEmbedPlayer.getCurrentTime()),
            this.#duration,
            ytEmbedPlayer.getVideoBytesLoaded()
        );
    }
}

customElements.define(YT_ELEMENT_NAME, YoutubePlayer);