import * as React from "react"
import { Header } from "../../components/Header.js"
import { Hint } from "../../components/Hint.js"
import { Hero } from "./components/Hero.js"
import { ScrollHint } from "../../components/ScrollHint.js"
import { DemoSelector } from "./components/DemoSelector.js"

export function Home() {
    return (
        <>
            <Header />
            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                <Hero />
                <DemoSelector />
                <ScrollHint />
                <Hint>
                    <div>
                        Navigation - <b>{"↑"}</b>, <b>{"↓"}</b>, <b>{"<-"}</b> and <b>{"->"}</b>
                    </div>
                    <div>
                        Select - <b>Enter</b> or <b>Space</b>
                    </div>
                    <div>
                        Go back - <b>Backspace</b>
                    </div>
                </Hint>
            </div>
        </>
    )
}
