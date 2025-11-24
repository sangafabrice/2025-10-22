export default function memoize(functionFn, cacheKey) {
    functionFn.cache?.constructor === Map || (functionFn.cache = new Map);
    return (
        functionFn.cache.get(cacheKey) ??
        functionFn.cache.set(cacheKey, functionFn(cacheKey)).get(cacheKey)
    );
}