import onReady from "./templates/progressBar.event.js";
import memoize from "./utils/memo.util.js";
import { reflectAttribute } from "./utils/reflection.util.js";
import { style, updateBufferBar, updateFillBar } from "./templates/progressBar.css.js";

const VALUE_ATTR_NAME = "value";
const BUFFER_ATTR_NAME = "buffer";
const ELEMENT_NAME = "fttl-progress-bar";

class ProgressBar extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: "open" });
        reflectAttribute(this, VALUE_ATTR_NAME);
        reflectAttribute(this, BUFFER_ATTR_NAME);
    }

    connectedCallback() {
        style(this);
    }

    async attributeChangedCallback(attrName, oldValue, value) {
        if (isNaN(value) || Number(oldValue) == Number(value)) return;
        await memoize(onReady, this);
        attrName == VALUE_ATTR_NAME
            ? updateFillBar(this, value)
            : updateBufferBar(this, value);
    }

    static get observedAttributes() {
        return [VALUE_ATTR_NAME, BUFFER_ATTR_NAME];
    }
}

customElements.define(ELEMENT_NAME, ProgressBar);