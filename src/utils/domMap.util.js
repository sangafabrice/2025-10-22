export default class ShadowDOMMap {
    #domMapper = new WeakMap;
    #templateMapFn;
    #shadowDOM;

    constructor(shadowDOM, templateMapFn) {
        this.#shadowDOM = shadowDOM;
        this.#templateMapFn = templateMapFn;
    }

    mapDOM(customElement) {
        return (
            this.#domMapper.get(customElement) ??
            this.#domMapper
                .set(
                    customElement,
                    (template => ({
                        template,
                        ...this.#templateMapFn(template),
                        deref: function () {
                            delete this.template;
                        },
                    }))(this.#shadowDOM.cloneNode(true))
                )
                .get(customElement)
        );
    }

    unmapDOM(customElement) {
        this.#domMapper.delete(customElement);
    }

    renderDOM(customElement) {
        if (customElement.shadowRoot.hasChildNodes()) return;
        const dom = this.mapDOM(customElement);
        customElement.shadowRoot.appendChild(dom.template);
        dom.deref();
    }

    static create() {
        const shadowDOMMap = new ShadowDOMMap(...arguments);
        return {
            mapDOM: shadowDOMMap.mapDOM.bind(shadowDOMMap),
            unmapDOM: shadowDOMMap.unmapDOM.bind(shadowDOMMap),
            renderDOM: shadowDOMMap.renderDOM.bind(shadowDOMMap),
        };
    }
}
