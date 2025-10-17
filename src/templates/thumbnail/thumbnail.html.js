import Resolution from "../../utils/resolution.util.js";
import { renderDOM } from "./thumbnail.dom.js";
import { style } from "./thumbnail.css.js";
import { reflectBooleanAttribute } from "../../utils/reflection.util.js";
import setThumbnailOnResize from "./thumbnail.event.js";

function clearResolutionAttributes(ytThumb) {
    Object.keys(Resolution).forEach(res => ytThumb[res] = false);
}

export function render(ytThumb) {
    clearResolutionAttributes(ytThumb);
    style(ytThumb);
    renderDOM(ytThumb);
    setThumbnailOnResize(ytThumb);
}

export function defineResolutionAttribute(ytThumb) {
    Object.keys(Resolution).forEach(reflectBooleanAttribute.bind(null, ytThumb));
}