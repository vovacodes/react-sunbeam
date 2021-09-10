import { motion } from "framer-motion"
import * as React from "react"
import { Colors } from "../../styles.js"

export function IconPresentation({
    width = 24,
    height = 24,
    focused,
}: {
    width?: number
    height?: number
    focused?: boolean
}) {
    return (
        <svg width={width} height={height} fill="#000000" viewBox="0 0 256 256">
            <rect width="256" height="256" fill="none" />
            <motion.rect
                animate={{ fill: focused ? Colors.paleGreen : Colors.lightGray }}
                transition={{ duration: 0.15 }}
                x="32"
                y="48"
                width="192"
                height="136"
                rx="8"
            />
            <rect
                x="32"
                y="48"
                width="192"
                height="136"
                rx="8"
                strokeWidth="16"
                stroke="#000000"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
            />
            <line
                x1="160"
                y1="184"
                x2="192"
                y2="224"
                fill="none"
                stroke="#000000"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="16"
            />
            <line
                x1="96"
                y1="184"
                x2="64"
                y2="224"
                fill="none"
                stroke="#000000"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="16"
            />
            <line
                x1="128"
                y1="48"
                x2="128"
                y2="24"
                fill="none"
                stroke="#000000"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="16"
            />
        </svg>
    )
}
