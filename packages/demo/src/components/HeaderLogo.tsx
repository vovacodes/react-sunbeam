import * as React from "react"
import { Colors } from "../styles.js"

export function HeaderLogo() {
    return (
        <div style={{ display: "flex", height: "60px", alignItems: "center" }}>
            <LogoGraphic />
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

function LogoGraphic() {
    return (
        <svg width="60" height="60">
            <path d="M 0 30.3 L 60 30.3" fill="hsla(200, 21%, 35%, 0.5)" strokeWidth="0.6" stroke="#F28787" />
            <path d="M 30 12 C 39.941 12 48 20.059 48 30 L 12 30 C 12 20.059 20.059 12 30 12 Z" fill="#F28787" />
            <path
                d="M 12.6 34.8 L 47.4 34.8"
                fill="transparent"
                strokeWidth="0.6"
                stroke="#F28787"
                strokeLinecap="round"
            />
            <path
                d="M 14.25 39.3 L 45.75 39.3"
                fill="transparent"
                strokeWidth="0.6"
                stroke="#F28787"
                strokeLinecap="round"
            />
            <path
                d="M 17.7 43.8 L 42.3 43.8"
                fill="transparent"
                strokeWidth="0.6"
                stroke="#F28787"
                strokeLinecap="round"
            />
            <path
                d="M 25.95 48.3 L 34.05 48.3"
                fill="transparent"
                strokeWidth="0.6"
                stroke="#F28787"
                strokeLinecap="round"
            />
        </svg>
    )
}
