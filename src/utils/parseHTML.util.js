export default function parseHTML(htmlTemplateString) {
    return Object.freeze(
        new DOMParser()
            .parseFromString(htmlTemplateString, "text/html")
            .querySelector("template").content
    );
}
