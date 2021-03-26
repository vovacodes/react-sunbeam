import * as React from "react"
import { Typography } from "../styles.js"
import { Chevron } from "./Chevron.js"

export function ScrollHint() {
    return (
        <div
            style={{
                position: "fixed",
                bottom: 20,
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
            }}
        >
            <div
                style={{
                    ...Typography.bodyText,
                    marginBottom: 10,
                }}
            >
                Press <b>↓</b> key or scroll down
            </div>
            <Chevron />
        </div>
    )
}
