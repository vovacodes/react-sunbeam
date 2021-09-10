import * as React from "react"
import { ReactNode } from "react"
import { styled } from "../styles.js"

const StyledHint = styled("div", {
    position: "fixed",
    bottom: 20,
    right: 20,
    typography: "smallText",

    "@phone": {
        display: "none",
    },
})

export function Hint({ children }: { children: ReactNode }) {
    return <StyledHint>{children}</StyledHint>
}
