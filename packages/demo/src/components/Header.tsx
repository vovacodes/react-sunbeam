import * as React from "react"
import { HeaderLogo } from "./HeaderLogo.js"

export function Header() {
    return (
        <header style={{ boxSizing: "border-box", height: "80px", padding: "10px 20px" }}>
            <HeaderLogo />
        </header>
    )
}
