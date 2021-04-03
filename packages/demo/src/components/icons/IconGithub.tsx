import * as React from "react"
import { motion } from "framer-motion"
import { Colors } from "../../styles.js"

export function IconGithub({ focused }: { focused?: boolean }) {
    return (
        <svg width="24" height="24" viewBox="0 0 256 256">
            <motion.path
                animate={{ fill: focused ? Colors.sunRed : Colors.lightGray }}
                transition={{ duration: 0.15 }}
                d="M64.51166,76.70377A51.90056,51.90056,0,0,1,68,32a51.9599,51.9599,0,0,1,43.82469,23.9988V56h32.35061V55.9988A51.9599,51.9599,0,0,1,188,32a51.90056,51.90056,0,0,1,3.48834,44.70377l0,0A47.77872,47.77872,0,0,1,200,104v8a48,48,0,0,1-48,48H104a48,48,0,0,1-48-48v-8a47.77872,47.77872,0,0,1,8.51163-27.29627Z"
            />
            <path
                d="M84,232a24,24,0,0,0,24-24V160"
                fill="none"
                stroke="#000000"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="16"
            />
            <path
                d="M172,232a24,24,0,0,1-24-24V160"
                fill="none"
                stroke="#000000"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="16"
            />
            <path
                d="M152,160h16a24,24,0,0,1,24,24v8a24,24,0,0,0,24,24"
                fill="none"
                stroke="#000000"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="16"
            />
            <path
                d="M104,160H88a24,24,0,0,0-24,24v8a24,24,0,0,1-24,24"
                fill="none"
                stroke="#000000"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="16"
            />
            <path
                d="M64.51166,76.70377A51.90056,51.90056,0,0,1,68,32a51.9599,51.9599,0,0,1,43.82469,23.9988V56h32.35061V55.9988A51.9599,51.9599,0,0,1,188,32a51.90056,51.90056,0,0,1,3.48834,44.70377l0,0A47.77872,47.77872,0,0,1,200,104v8a48,48,0,0,1-48,48H104a48,48,0,0,1-48-48v-8a47.77872,47.77872,0,0,1,8.51163-27.29627Z"
                fill="none"
                stroke="#000000"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="16"
            />
        </svg>
    )
}
