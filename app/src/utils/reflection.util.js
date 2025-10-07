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