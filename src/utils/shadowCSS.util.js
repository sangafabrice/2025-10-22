export default class ShadowCSS {
    #sheet = new CSSStyleSheet;

    constructor(cssText) {
        Object.freeze(this.#sheet).replace(cssText);
    }

    style(customElement, ...additionalSheets) {
        customElement.shadowRoot.adoptedStyleSheets.push(this.#sheet, ...additionalSheets);
    }

    static create() {
        const shadowCSS = new ShadowCSS(...arguments);
        return { style: shadowCSS.style.bind(shadowCSS) };
    }
}