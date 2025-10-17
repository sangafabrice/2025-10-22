export default function (httpRequestFn, cacheKey, onOfflineCb) {
    httpRequestFn.cache?.constructor === Map ||
        (httpRequestFn.cache = new Map);
    return (
        httpRequestFn.cache.get(cacheKey) ??
        (navigator.onLine
            ? httpRequestFn.cache
                  .set(cacheKey, httpRequestFn(cacheKey))
                  .get(cacheKey)
            : onOfflineCb?.(cacheKey) ?? false)
    );
}