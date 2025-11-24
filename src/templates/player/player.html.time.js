import { getFormattedDuration } from "../../utils/duration.util.js";
import { PROGRESS_DELAY } from "../progressBar/progressBar.css.js";
import { mapDOM } from "./player.dom.js";

function setCurrentTime({ timerDisplay: { dataset } }, currentTime) {
    dataset.currentTime = getFormattedDuration(currentTime);
}

function updateProgressBar({ progressBar }, currentTime, duration, bufferRate) {
    Object.assign(progressBar, {
        value: (currentTime + PROGRESS_DELAY)/duration,
        buffer: bufferRate
    });
}

function setHrefCurrentTimeQuery({ anchor }, url, currentTime) {
    url?.searchParams.set("t", Math.floor(currentTime));
    url && (anchor.href = url);
}

export function renderCurrentTime(ytPlayer) {
    const dom = mapDOM(ytPlayer);
    setCurrentTime(dom, arguments[2]);
    updateProgressBar(dom, ...[...arguments].slice(2));
    setHrefCurrentTimeQuery(dom, ...[...arguments].slice(1, 3));
}

export function renderDuration({ duration }, { timer, timerSROnly, timerDisplay: { dataset } }, callback) {
    timer.dateTime = getFormattedDuration(duration, "machine");
    timerSROnly.innerText = "Duration: " + getFormattedDuration(duration, "sr-only");
    dataset.duration = getFormattedDuration(duration);
    callback(duration);
}