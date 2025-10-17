function getPluralSuffix(durationPart) {
    return { one: "", other: "s" }[new Intl.PluralRules("en").select(durationPart)];
}

function getDurationParts(durationInSeconds) {
    const duration = new Date(durationInSeconds * 1000);
    const durationParts = [, duration.getUTCMinutes(), duration.getUTCSeconds()];
    durationInSeconds >= 3600 && (durationParts[0] = duration.getUTCHours());
    return durationParts;
}

function removeEmptyZeroDurationParts(durationParts) {
    durationParts.forEach((part, index) => part || delete durationParts[index]);
}

function addUnitsToDurationParts(durationParts, units, pluralRuleCb) {
    durationParts.forEach((part, index) => part && (durationParts[index] = `${part}${units[index]}${pluralRuleCb?.(part) ?? ""}`));
}

function getProcessedDurationParts(durationInSeconds) {
    const durationParts = getDurationParts(durationInSeconds);
    removeEmptyZeroDurationParts(durationParts);
    addUnitsToDurationParts(durationParts, ...[...arguments].slice(1));
    return durationParts;
}

function getMachineFormattedDuration(durationInSeconds) {
    return "PT" + getProcessedDurationParts(durationInSeconds, ["H", "M", "S"]).flat().join("");
}

function getSROnlyFormattedDuration(durationInSeconds) {
    return getProcessedDurationParts(durationInSeconds, ["hour", "minute", "second"], getPluralSuffix).flat().join(" ");
}

function getDigitalFormattedDuration(durationInSeconds) {
    return getDurationParts(durationInSeconds).flat().join(":").replace(/:(\d)\b/g, ":0$1");
}

export function getFormattedDuration(durationInSeconds, target) {
    switch (target) {
        case "sr-only": return getSROnlyFormattedDuration(durationInSeconds);
        case "machine": return getMachineFormattedDuration(durationInSeconds);
        default: return getDigitalFormattedDuration(durationInSeconds);
    }
}