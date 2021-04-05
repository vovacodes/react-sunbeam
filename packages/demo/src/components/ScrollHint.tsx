import * as React from "react"
import { styled, Typography } from "../styles.js"
import { Chevron } from "./Chevron.js"

const StyledScrollHint = styled("div", {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",

    "@phone": {
        display: "none",
    },
})

export function ScrollHint() {
    return (
        <StyledScrollHint>
            <div
                style={{
                    ...Typography.bodyText,
                    marginBottom: 10,
                }}
            >
                Press the <b>↓</b> key or scroll down
            </div>
            <Chevron />
        </StyledScrollHint>
    )
}
