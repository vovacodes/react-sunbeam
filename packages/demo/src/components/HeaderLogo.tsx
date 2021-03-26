import * as React from "react"
import { Colors } from "../styles.js"
import { Logo } from "./Logo.js"

export function HeaderLogo() {
    return (
        <div style={{ display: "flex", height: "60px", alignItems: "center" }}>
            <Logo width={60} height={60} />
            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    marginLeft: "16px",
                    fontFamily: "DM Serif Display, serif",
                    fontSize: "22px",
                    lineHeight: 1,
                    color: Colors.textBlack,
                }}
            >
                <div>React</div>
                <div>Sunbeam</div>
            </div>
        </div>
    )
}
