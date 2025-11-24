export default function getVideoUrl({ videoId }) {
    return "https://youtu.be/" + (videoId ?? (() => { throw undefined; })());
}