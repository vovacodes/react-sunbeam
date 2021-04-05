import { createCss } from "@stitches/react"

export const MEDIA_QUERY_PHONE = "(max-width: 640px)"

export const { styled, css, theme, keyframes: createKeyframes } = createCss({
    theme: {
        colors: {
            pureBlack: "rgba(0, 0, 0, 1)",
            pastelWhite: "#FFFCF5",
            graphite: "#3D3D3D",
            lightGray: "#DEDEDE",
            sunRed: "rgba(242, 135, 135, 1)", // "#f28787"
            paleCyan: "rgba(179, 244, 255, 1)", // "#CFFDFF",
            paleGreen: "#9ce3c5",
            palePink: "#ffe6e8",
            paleBlue: "#a5c5fd",
            paleYellow: "#fff59e",

            background: "$pastelWhite",
            text: "$graphite",
        },
        fonts: {
            serif: "DM Serif Display, serif",
            mono: `"Fira Code", monospace`,
        },
    },
    media: {
        phone: MEDIA_QUERY_PHONE,
    },
    utils: {
        typography: () => (value: "heading1" | "heading2" | "subtitle" | "bodyText" | "smallText") => {
            switch (value) {
                case "heading1":
                    return {
                        fontFamily: "$serif",
                        color: "$text",
                        fontSize: "52px",
                        lineHeight: 1.2,
                        fontWeight: 400,

                        "@phone": {
                            fontSize: "36px",
                        },
                    }
                case "heading2":
                    return {
                        fontFamily: "$serif",
                        color: "$text",
                        fontSize: "36px",
                        lineHeight: 1.2,
                        fontWeight: 400,

                        "@phone": {
                            fontSize: "26px",
                        },
                    }
                case "subtitle":
                    return {
                        fontFamily: "$mono",
                        fontSize: 26,
                        lineHeight: 1.4,
                        color: "$text",
                        fontWeight: 400,

                        "@phone": {
                            fontSize: "18px",
                        },
                    }
                case "bodyText": {
                    return {
                        fontFamily: "$mono",
                        fontSize: "16px",
                        lineHeight: 1.6,
                        color: "$text",
                        fontWeight: 400,
                    }
                }
                case "smallText":
                    return {
                        fontFamily: "$mono",
                        fontSize: 13,
                        lineHeight: 1.6,
                        color: "$text",
                        fontWeight: 400,
                    }
            }
        },
    },
})

export const Colors = {
    background: "#FFFCF5",
    pureBlack: "rgba(0, 0, 0, 1)",
    textBlack: "#3D3D3D",
    lightGray: "#DEDEDE",
    sunRed: "rgba(242, 135, 135, 1)", // "#f28787"
    paleCyan: "rgba(179, 244, 255, 1)", // "#CFFDFF",
    paleGreen: "#9ce3c5",
    palePink: "#ffe6e8",
    paleBlue: "#a5c5fd",
    paleYellow: "#fff59e",
}

export const Typography = {
    heading1: {
        fontFamily: "DM Serif Display, serif",
        color: Colors.textBlack,
        fontSize: "52px",
        lineHeight: 1.2,
        fontWeight: 400,
    },
    heading2: {
        fontFamily: "DM Serif Display, serif",
        color: Colors.textBlack,
        fontSize: "36px",
        lineHeight: 1.2,
        fontWeight: 400,
    },
    subtitle: {
        fontFamily: `"Fira Code", monospace`,
        fontSize: 26,
        lineHeight: 1.4,
        color: Colors.textBlack,
        fontWeight: 400,
    },
    bodyText: {
        fontFamily: `"Fira Code", monospace`,
        fontSize: 16,
        lineHeight: 1.6,
        color: Colors.textBlack,
        fontWeight: 400,
    },
    smallText: {
        fontFamily: `"Fira Code", monospace`,
        fontSize: 13,
        lineHeight: 1.6,
        color: Colors.textBlack,
        fontWeight: 400,
    },
}

export const keyframes = {
    hovering: createKeyframes({
        from: {
            transform: "translate(0, 0)",
        },
        to: {
            transform: "translate(-4px, -4px)",
        },
    }),
}
