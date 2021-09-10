import * as React from "react"
import { css, styled } from "../styles.js"
import { Logo } from "./Logo.js"

const LogoText = styled("div", {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    marginLeft: "16px",
    fontFamily: "$serif",
    fontSize: "22px",
    lineHeight: 1,
    color: "$text",

    "@phone": {
        display: "none",
    },
})

const logoClass = css({
    width: 60,
    height: 60,

    "@phone": {
        width: 40,
        height: 40,
    },
})

export function HeaderLogo() {
    return (
        <div style={{ display: "flex", height: "60px", alignItems: "center" }}>
            <Logo className={logoClass()} />
            <LogoText>
                <div>React</div>
                <div>Sunbeam</div>
            </LogoText>
        </div>
    )
}
