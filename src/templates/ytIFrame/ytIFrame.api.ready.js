const script = document.body.appendChild(
    Object.assign(document.createElement("script"), {
        async: true,
        src: "https://www.youtube.com/iframe_api",
    })
);

export default Object.freeze(
    new Promise(function (resolve) {
        window.onYouTubeIframeAPIReady = () => {
            delete window.onYouTubeIframeAPIReady;
            script.remove();
            resolve(true);
        };
    })
);