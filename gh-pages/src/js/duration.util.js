export const TOTAL_DURATION = 3*60*1000;
let startTime = Date.now();

function getCurrentTime() {
    const now = Date.now();
    const timeDiff = now - startTime;
    if (timeDiff > TOTAL_DURATION) startTime = now;
    return timeDiff % TOTAL_DURATION;
}

function getTimeRate(currentTime) {
    return currentTime / TOTAL_DURATION;
}

function formatCurrentTime(currentTime) {
    const ct = new Date(currentTime);
    const seconds = ct.getUTCSeconds();
    return `${ct.getUTCMinutes()}:${ seconds < 10 ? 0:""}${seconds}`;
}

export function getDurationObject() {
    const ct = getCurrentTime();
    return [formatCurrentTime(ct), getTimeRate(ct)];
}