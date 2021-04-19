const Label0Css = (fSize, fill, align = "center") => {
    return {
        fontSize: fSize,
        fontFamily: "PS2P",
        align: align,
        fill: fill,
    }
}

const Label1Css = (fSize, fill, align = "left") => { // mostly used in LoaderScene
    return {
        fontSize: fSize,
        fontFamily: "monospace",
        align: align,
        fill: fill,
    }
}