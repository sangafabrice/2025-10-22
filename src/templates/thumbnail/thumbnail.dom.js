import ShadowDOMMap from "../../utils/domMap.util.js";
import parseHTML from "../../utils/parseHTML.util.js";
import shadowDOMHtml from "./assets/bin/template.min.html";
import playButtonImage from "./assets/yt-play-icon.svg";

const shadowDOM = parseHTML(shadowDOMHtml);
shadowDOM.querySelector("slot").insertAdjacentHTML("afterend", playButtonImage);

function getShadowDOMMap (shadowDOM) {
    return { style: shadowDOM.firstElementChild }
}

const { mapDOM, unmapDOM, renderDOM } = ShadowDOMMap.create(shadowDOM, getShadowDOMMap);

export { mapDOM, unmapDOM, renderDOM };