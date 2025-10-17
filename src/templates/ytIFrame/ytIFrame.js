import YoutubeIFrameConverter from "./ytIFrame.converter.js";
import { httpTestVideoId } from "../../utils/videoIdValidation.http.js";

class YoutubeIFrame {
    static #creator;
   
    constructor() {
        return (
            YoutubeIFrame.#creator ??
            (YoutubeIFrame.#creator = Object.freeze(this))
        );
    }

    create(newiframe) {
        const iframe = newiframe ?? document.createElement("iframe");
        this.#attributeChangedObserver.observe(iframe, {
            attributeFilter: ["data-src"],
            attributes: true,
            attributeOldValue: true,
        });
        return iframe;
    }

    #attributeChangedObserver = new MutationObserver(records =>
        records.forEach(YoutubeIFrame.#attributeChangedCallback)
    );

    static async #attributeChangedCallback({ target, oldValue }) {
        const videoId = target.dataset.src;
        if (!await httpTestVideoId(videoId) || oldValue == videoId)
            return;
        YoutubeIFrameConverter.convert(target);
    }
}

export default new YoutubeIFrame;