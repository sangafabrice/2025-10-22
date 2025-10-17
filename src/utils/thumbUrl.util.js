import Resolution from "./resolution.util.js";

export default function getThumbnailUrl({ videoId }, resolution) {
    return Resolution[resolution]
        ? `https://i.ytimg.com/vi/${
            videoId ?? (() => { throw undefined; })()
        }/${resolution}default.jpg`
        : (() => { throw undefined; })();
}