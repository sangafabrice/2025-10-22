import getHttpCachedValue from "./_memo.http.js";
import getVideoUrl from "./videoUrl.util.js";

async function httpTestVideoId(videoId) {
    return fetch(
        `https://www.youtube.com/oembed?url=${getVideoUrl({
            videoId
        })}&format=json`,
        { method: "HEAD" }
    ).then(({ ok }) => ok);
}

export default async function (videoId) {
    return /^[a-zA-Z0-9_-]{11}$/.test(videoId)
        ? getHttpCachedValue(httpTestVideoId, videoId)
        : false;
}