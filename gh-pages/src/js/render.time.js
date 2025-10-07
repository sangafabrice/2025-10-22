import { getDurationObject, TOTAL_DURATION } from "./duration.util.js";

const PROGRESS_DELAY = 1000 / TOTAL_DURATION;
const PROGRESS_BAR = $("fttl-progress-bar");
const TIMER = $("time");

function updateBuffer(progressTimeRate) {
    return (_, buffer) => Math.max(Number(buffer), Math.min(progressTimeRate + Math.random()/5, 1));
}

function updateVisualCurrentTimeRate(progressTimeRate) {
    return progressTimeRate + PROGRESS_DELAY;
}

function renderCurrentTime(currentTime, progressTimeRate) {
    if (document.hidden) return;
    PROGRESS_BAR.attr({
        value: updateVisualCurrentTimeRate(progressTimeRate),
        buffer: updateBuffer(progressTimeRate)
    });
    TIMER.text(currentTime);
}

export default function renderCurrentTimeOnTick() {
    const deferred = $.Deferred().progress(renderCurrentTime);
    setInterval(() => deferred.notify(...getDurationObject()), 1000);
}