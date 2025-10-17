import getHttpCachedValue from "./_memo.http.js";
import getThumbnailUrl from "./thumbUrl.util.js";

async function httpRequestThumbnail(thumbnailUrl) {
    return fetch(thumbnailUrl)
        .then(response => {
            if (!response.ok) throw null;
            return response.blob();
        })
        .then(URL.createObjectURL);
}

export default async function () {
    return getHttpCachedValue(
        httpRequestThumbnail,
        getThumbnailUrl(...arguments),
        () => { throw undefined; }
    );
}