import * as React from "react"
import { motion } from "framer-motion"

export function Logo({
    width = 60,
    height = 60,
    solid = true,
    className,
}: {
    width?: number
    height?: number
    className?: string
    solid?: boolean
}) {
    return (
        <svg viewBox="0 0 270 270" className={className} width={width} height={height}>
            <path d="M 0 136.35 L 270 136.35" strokeWidth="2.7" stroke="#F28787" />
            <motion.path
                d="M 135 55 C 179.735 55 216 91.265 216 136 L 54 136 C 54 91.265 90.265 55 135 55 Z"
                initial="solid"
                fill="rgb(242, 135, 135, 1)"
                animate={solid ? "solid" : "outlined"}
                variants={{
                    solid: {
                        fill: "rgb(242, 135, 135, 1)",
                    },
                    outlined: {
                        fill: "rgb(242, 135, 135, 0)",
                    },
                }}
                strokeWidth="2.7"
                stroke="#F28787"
            />
            <path
                d="M 56.7 156.6 L 213.3 156.6"
                fill="transparent"
                strokeWidth="2.7"
                stroke="#F28787"
                strokeLinecap="round"
            />
            <path
                d="M 64.125 176.85 L 205.875 176.85"
                fill="transparent"
                strokeWidth="2.7"
                stroke="#F28787"
                strokeLinecap="round"
            />
            <path
                d="M 79.65 197.1 L 190.35 197.1"
                fill="transparent"
                strokeWidth="2.7"
                stroke="#F28787"
                strokeLinecap="round"
            />
            <path
                d="M 116.775 217.35 L 153.225 217.35"
                fill="transparent"
                strokeWidth="2.7"
                stroke="#F28787"
                strokeLinecap="round"
            />
        </svg>
    )
}
