import * as React from "react"
import { useRef, useState } from "react"
import { Logo } from "../../../components/Logo.js"
import { Typography } from "../../../styles.js"
import { PageSlide } from "../../../components/PageSlide.js"

export function Hero() {
    const ref = useRef<HTMLDivElement>(null)

    const [focused, setFocused] = useState(false)

    return (
        <PageSlide id="hero" ref={ref} onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}>
            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    // Better visual alignment
                    position: "relative",
                    top: -100,
                }}
            >
                <Logo width={200} height={200} solid={focused} />
                <h1
                    style={{
                        ...Typography.heading1,
                    }}
                >
                    React Sunbeam
                </h1>
                <h2
                    style={{
                        textAlign: "center",
                        ...Typography.subtitle,
                    }}
                >
                    Spacial navigation and keypress
                    <br />
                    management solution for React apps
                </h2>
            </div>
        </PageSlide>
    )
}
