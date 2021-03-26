import * as React from "react"
import { HeaderLogo } from "./HeaderLogo.js"

export const HEADER_HEIGHT_PX = 80

export function Header() {
    return (
        <header
            style={{
                position: "fixed",
                top: 0,
                boxSizing: "border-box",
                height: `${HEADER_HEIGHT_PX}px`,
                padding: "10px 20px",
            }}
        >
            <HeaderLogo />
        </header>
    )
}
