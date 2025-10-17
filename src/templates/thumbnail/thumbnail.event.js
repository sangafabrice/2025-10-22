import Resolution from "../../utils/resolution.util.js";
import { httpRequestThumbnail } from "../../utils/thumbUrl.http.js";
import { httpTestVideoId } from "../../utils/videoIdValidation.http.js";
import { appendPrevThumb, getResolutionCSSRule, setThumbnail } from "./thumbnail.css.js";

const [HQ_MAX_WIDTH, SD_MAX_WIDTH] = [480, 640];

async function isReady({ videoId, isConnected }) {
    return (await httpTestVideoId(videoId)) && isConnected;
}

async function applyDownloadedThumbnail(ytThumb, resolution, blobUrl) {
    setThumbnail(await getResolutionCSSRule(ytThumb, resolution), resolution, blobUrl);
    ytThumb[resolution] = true;
    await new Promise(r => setTimeout(r, 500));
    appendPrevThumb(ytThumb, blobUrl);
}

async function _setThumbnailOnResize(ytThumb, maxWidth, firstCompare) {
    let resAttr = maxWidth <= HQ_MAX_WIDTH ? Resolution.hq : maxWidth <= SD_MAX_WIDTH ? Resolution.sd : Resolution.maxres;
    arguments[1] = maxWidth = Math.max(maxWidth, ytThumb.clientWidth);
    if (!(navigator.onLine && await isReady(ytThumb))) return [...arguments];
    if (
        (firstCompare || resAttr == Resolution.maxres) &&
        (await httpRequestThumbnail(ytThumb, resAttr)
            .then(applyDownloadedThumbnail.bind(null, ytThumb, resAttr))
            .then(() => false)
            .catch(err => !(
                err == null &&
                [Resolution.hq, Resolution.sd].some(res => ytThumb.getAttributeNames().indexOf(res) + 1)
            )))
    ) {
        arguments[1] = resAttr == Resolution.maxres ? SD_MAX_WIDTH : HQ_MAX_WIDTH;
        return [...arguments];
    }
    if (resAttr == Resolution.maxres) return null;
    ytThumb[resAttr] = true;
    arguments[arguments.length - 1] = false;
    return [...arguments];
}

export default function setThumbnailOnResize(ytThumb) {
    let watch = Promise.resolve([ytThumb, ytThumb.clientWidth, true]),
        args = [];
    const { videoId } = ytThumb,
        diffId = () => videoId != ytThumb.videoId;
    const task = async function () {
        args = await watch;
        if (diffId() || !args) return;
        watch = _setThumbnailOnResize(...args);
        setTimeout(task, 500);
    };
    task();
}