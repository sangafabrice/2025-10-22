import { unmapDOM } from "./templates/thumbnail/thumbnail.dom.js";
import { defineResolutionAttribute, render } from "./templates/thumbnail/thumbnail.html.js";
import { reflectAttribute, reflectBooleanAttribute } from "./utils/reflection.util.js";
import { httpTestVideoId } from "./utils/videoIdValidation.http.js";

const VIDEO_ID_ATTR_NAME = "video-id";
const YT_ELEMENT_NAME = "fttl-yt-thumb";

class YouTubeThumbnail extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: "open" });
        reflectAttribute(this, VIDEO_ID_ATTR_NAME);
        reflectBooleanAttribute(this, "no-icon");
        defineResolutionAttribute(this);
    }

    async attributeChangedCallback(_, oldId, videoId) {
        if (oldId == videoId || !(await httpTestVideoId(videoId))) return;
        render(this);
    }

    static get observedAttributes() {
        return [VIDEO_ID_ATTR_NAME];
    }

    disconnectedCallback() {
        unmapDOM(this);
    }
}

customElements.define(YT_ELEMENT_NAME, YouTubeThumbnail);