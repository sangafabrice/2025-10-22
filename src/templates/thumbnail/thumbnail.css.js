import { mapDOM } from "./thumbnail.dom.js";
import getThumbnailUrl from "../../utils/thumbUrl.util.js";
import Resolution from "../../utils/resolution.util.js";
import shadowCssText from "./assets/shadow.css";

const THUMBNAIL_URL_CSS_VAR_PREFIX = "--yt-thumbnail-url-";

function getResolutionCSSSelector(resolution) {
    return `:host([${resolution}])`;
}

function waitCSSSheet({ style }) {
    const doWhile = resolve => {
        if (!style.sheet) return setTimeout(doWhile, 0, resolve);
        resolve();
    };
    return new Promise(doWhile);
}

function initStyle(ytThumb) {
    mapDOM(ytThumb).style.textContent = Object.keys(Resolution).reduce(
        (styleText, res) =>
            styleText +
            getResolutionCSSSelector(res) +
            `{${
                res != Resolution.maxres
                    ? `${THUMBNAIL_URL_CSS_VAR_PREFIX + res}:` +
                      `url(${getThumbnailUrl(ytThumb, res)})`
                    : ""
            }}`,
        shadowCssText
    );
}

function updateStyle(ytThumb) {
    Object.keys(Resolution).forEach(async res => {
        if (res != Resolution.maxres)
            return setThumbnail(
                await getResolutionCSSRule(ytThumb, res),
                res,
                getThumbnailUrl(ytThumb, res)
            );
        (await getResolutionCSSRule(ytThumb, res)).style.removeProperty(
            THUMBNAIL_URL_CSS_VAR_PREFIX + res
        );
    });
}

export function style(ytThumb) {
    mapDOM(ytThumb).style.textContent.length === 0
        ? initStyle(ytThumb)
        : updateStyle(ytThumb);
}

export async function getResolutionCSSRule(ytThumb, resolution) {
    await waitCSSSheet(mapDOM(ytThumb));
    return [...(mapDOM(ytThumb).style.sheet?.cssRules ?? [])].filter(
        ({ selectorText }) => selectorText?.startsWith(getResolutionCSSSelector(resolution))
    )[0];
}

export function setThumbnail({ style }, resolution, url) {
    style.setProperty(THUMBNAIL_URL_CSS_VAR_PREFIX + resolution, `url(${url})`);
}

export function appendPrevThumb(ytThumb, blobUrl) {
    const { sheet } = mapDOM(ytThumb).style;
    sheet.insertRule(
        `#host{${THUMBNAIL_URL_CSS_VAR_PREFIX}previous:url(${blobUrl})}`,
        sheet.cssRules.length
    );
}