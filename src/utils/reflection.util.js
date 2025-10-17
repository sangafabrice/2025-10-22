function convertToPropertyName(attributeName) {
    return attributeName
        .toLowerCase()
        .replace(/-([a-z])/g, (_, char) => char.toUpperCase());
}

export function reflectAttribute(customElement, attributeName) {
    Object.defineProperty(customElement, convertToPropertyName(attributeName), {
        get: function () {
            return customElement.getAttribute(attributeName);
        },
        set: function (value) {
            customElement.setAttribute(attributeName, value);
        },
    })
}

export function reflectBooleanAttribute(customElement, attributeName) {
    Object.defineProperty(customElement, convertToPropertyName(attributeName), {
        get: function () {
            return customElement.hasAttribute(attributeName);
        },
        set: function (value) {
            if (typeof value != "boolean")
                throw Error(`boolean value expected in ${attributeName}`);
            value
                ? customElement.setAttribute(attributeName, "")
                : customElement.removeAttribute(attributeName);
        },
    });
}