import * as React from "react"
import { HeaderLogo } from "./HeaderLogo.js"
import { Link } from "react-router-dom"
import { styled } from "../styles.js"

export const HEADER_HEIGHT_PX = 80

const StyledHeader = styled("header", {
    position: "fixed",
    top: 0,
    boxSizing: "border-box",
    height: `${HEADER_HEIGHT_PX}px`,
    padding: "10px 20px",
    zIndex: 1,

    "@phone": {
        position: "static",
        height: "60px",
    },
})

const StyledLink = styled(Link, {
    textDecoration: "none",
    color: "inherit",
})

export function Header() {
    return (
        <StyledHeader>
            <StyledLink to="/">
                <HeaderLogo />
            </StyledLink>
        </StyledHeader>
    )
}
