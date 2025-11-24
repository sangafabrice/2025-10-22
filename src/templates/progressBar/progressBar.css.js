import ShadowCSS from "../../utils/shadowCSS.util.js";
import shadowCssText from "./assets/bin/shadow.min.css";

const VALUE_CSS_VAR = "--value-rate";
const BUFFER_CSS_VAR = "--buffer-rate";
export const PROGRESS_DELAY = 1;

const shadowCSS = new ShadowCSS(shadowCssText);

export function getInlineStyle(progressBar) {
    return progressBar.shadowRoot.adoptedStyleSheets[1].cssRules[0].style;
}

export function style(progressBar) {
    const embedCSS = Object.freeze(new CSSStyleSheet);
    embedCSS.insertRule(":host{}");
    shadowCSS.style(progressBar, embedCSS);
}

export function updateFillBar(progressBar, rate) {
    getInlineStyle(progressBar).setProperty(VALUE_CSS_VAR, Number(rate));
}

export function updateBufferBar(progressBar, rate) {
    getInlineStyle(progressBar).setProperty(BUFFER_CSS_VAR, Number(rate));
}