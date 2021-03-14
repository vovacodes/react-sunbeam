import * as React from "react"
import { ReactNode } from "react"
import { Typography } from "../styles.js"

export function Hint({ children }: { children: ReactNode }) {
    return (
        <div
            style={{
                position: "absolute",
                bottom: 20,
                right: 20,
                ...Typography.smallText,
            }}
        >
            {children}
        </div>
    )
}
