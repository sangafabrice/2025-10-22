window.jQuery ??
    document.currentScript.insertAdjacentElement(
        "beforeBegin",
        Object.assign(document.createElement("script"), {
            src: "https://ajax.googleapis.com/ajax/libs/jquery/3.7.1/jquery.min.js",
        })
    );