import * as React from "react"
import { useRef, useState } from "react"
import { useFocusManager } from "react-sunbeam"
import { Logo } from "../../../components/Logo.js"
import { Typography } from "../../../styles.js"
import { PageSlide } from "../../../components/PageSlide.js"
import { Button } from "../../../components/Button.js"
import { IconGithub } from "../../../components/icons/IconGithub.js"
import { IconPresentation } from "../../../components/icons/IconPresentation.js"

const REPO_URL = "https://github.com/vovacodes/react-sunbeam/tree/master/packages/react-sunbeam"

export function Hero() {
    const ref = useRef<HTMLDivElement>(null)

    const [focused, setFocused] = useState(false)
    const focusManager = useFocusManager()

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
                <div style={{ marginTop: "40px", display: "flex", justifyContent: "center", alignItems: "center" }}>
                    <Button
                        icon={<IconPresentation />}
                        onPress={() => {
                            focusManager.setFocus(["demo-selector"])
                        }}
                    >
                        Explore demos
                    </Button>
                    <div style={{ width: "80px" }} />
                    <Button
                        icon={<IconGithub />}
                        onPress={() => {
                            window.open(REPO_URL, "_blank") || location.assign(REPO_URL)
                        }}
                    >
                        Read code
                    </Button>
                </div>
            </div>
        </PageSlide>
    )
}
