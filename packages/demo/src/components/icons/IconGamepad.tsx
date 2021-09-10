import * as React from "react"

export function IconGamepad({ width = 24, height = 24 }: { width?: number; height?: number }) {
    return (
        <svg width={width} height={height} fill="#000000" viewBox="0 0 256 256">
            <rect width="256" height="256" fill="none" />
            <line
                x1="152"
                y1="108"
                x2="184"
                y2="108"
                fill="none"
                stroke="#000000"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="16"
            />
            <line
                x1="72"
                y1="108"
                x2="104"
                y2="108"
                fill="none"
                stroke="#000000"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="16"
            />
            <line
                x1="88"
                y1="92"
                x2="88"
                y2="124"
                fill="none"
                stroke="#000000"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="16"
            />
            <path
                d="M172.01831,55.7398,84.00446,56A52.01509,52.01509,0,0,0,32.78594,98.96873l.00852.00156-16.3644,84.16289A28.00192,28.00192,0,0,0,63.80532,207.796l-.00165-.00173L107.03924,160l64.97907-.2602a52,52,0,0,0,0-104Z"
                fill="none"
                stroke="#000000"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="16"
            />
            <path
                d="M223.22831,98.71009l16.351,84.42309A28.00192,28.00192,0,0,1,192.204,207.796l.00166-.00173L149,159.832"
                fill="none"
                stroke="#000000"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="16"
            />
        </svg>
    )
}
