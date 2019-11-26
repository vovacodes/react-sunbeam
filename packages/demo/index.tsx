import * as React from "react"
import { useCallback, useState } from "react"
import { render } from "react-dom"
import {
    Direction,
    Focusable,
    FocusableTreeNode,
    FocusEvent,
    FocusManager,
    SunbeamProvider,
    unstable_defaultGetPreferredChildOnFocusReceive,
    KeyPressManager,
} from "react-sunbeam"

import { ProfilesMenu } from "./ProfilesMenu"
import { GamesGallery } from "./GamesGallery"
import { NavigationMenu } from "./NavigationMenu"

const focusManager = new FocusManager({
    initialFocusPath: ["gallery", "1"],
})
const keyPressManager = new KeyPressManager()
keyPressManager.addListener(event => {
    switch (event.key) {
        case "ArrowRight":
            event.preventDefault()
            focusManager.moveRight()
            return

        case "ArrowLeft":
            event.preventDefault()
            focusManager.moveLeft()
            return

        case "ArrowUp":
            event.preventDefault()
            focusManager.moveUp()
            return

        case "ArrowDown":
            event.preventDefault()
            focusManager.moveDown()
            return
    }
})

render(
    <SunbeamProvider
        focusManager={focusManager}
        keyPressManager={keyPressManager}
        onFocusUpdate={handleFocusUpdate}
        unstable_getPreferredChildOnFocusReceive={({
            focusableChildren,
            focusOrigin,
            direction,
        }: {
            focusableChildren: Map<string, FocusableTreeNode>
            focusOrigin?: FocusableTreeNode
            direction?: Direction
        }) => {
            if (!focusOrigin || !direction) {
                // focus the gallery initially
                if (focusableChildren.has("gamesGallery")) return focusableChildren.get("gamesGallery")
            }

            return unstable_defaultGetPreferredChildOnFocusReceive({ focusableChildren, focusOrigin, direction })
        }}
    >
        <App />
    </SunbeamProvider>,
    document.getElementById("app")
)

function App() {
    const [selectedItem, setSelectedItem] = useState<string | null>(null)
    const [screen, setScreen] = useState("home")

    const handleItemFocus = useCallback(
        (event: FocusEvent) => {
            const path = event.focusablePath.join("->")
            // console.log(`onFocus: ${path}`)
            setSelectedItem(path)
        },
        [setSelectedItem]
    )
    const handleItemBlur = useCallback((event: FocusEvent) => {
        // console.log(`onBlur: ${event.focusablePath.join("->")}`)
    }, [])
    const handleContainerFocus = useCallback((event: FocusEvent) => {
        // console.log(`onFocus: ${event.focusablePath.join("->")}`)
    }, [])
    const handleContainerBlur = useCallback((event: FocusEvent) => {
        // console.log(`onBlur: ${event.focusablePath.join("->")}`)
    }, [])

    if (screen === "detail") {
        // TODO: implement Detail screen
        return (
            <div>
                <Focusable
                    focusKey="detail-focusable"
                    style={{ display: "flex" }}
                    onKeyPress={event => {
                        if (event.key !== "Backspace") return
                        event.preventDefault()
                        setScreen("home")
                    }}
                >
                    {({ focused }) => (
                        <div>
                            <h1>Detail page for {selectedItem}</h1>
                            <div>Focused: {JSON.stringify(focused)}</div>
                        </div>
                    )}
                </Focusable>
            </div>
        )
    }

    return (
        <Focusable
            onKeyPress={event => {
                if (event.key === " " || event.key === "Enter") {
                    event.preventDefault()
                    event.stopPropagation()
                    console.log('Handling "Enter" key in Home Screen')
                    setScreen("detail")
                }
            }}
        >
            <div
                style={{
                    backgroundColor: "#2D2D2D",
                    display: "flex",
                    flexDirection: "column",
                    height: "720px",
                    width: "1280px",
                    overflow: "hidden",
                }}
            >
                <div style={{ marginTop: "32px", marginLeft: "60px" }}>
                    <ProfilesMenu
                        onFocus={handleContainerFocus}
                        onBlur={handleContainerBlur}
                        onItemFocus={handleItemFocus}
                        onItemBlur={handleItemBlur}
                    />
                </div>
                <div style={{ marginTop: "94px", alignSelf: "center" }}>
                    <GamesGallery
                        onFocus={handleContainerFocus}
                        onBlur={handleContainerBlur}
                        onItemFocus={handleItemFocus}
                        onItemBlur={handleItemBlur}
                    />
                </div>
                <div style={{ marginTop: "94px", alignSelf: "center" }}>
                    <NavigationMenu
                        onFocus={handleContainerFocus}
                        onBlur={handleContainerBlur}
                        onItemFocus={handleItemFocus}
                        onItemBlur={handleItemBlur}
                    />
                </div>
            </div>
        </Focusable>
    )
}

function handleFocusUpdate({ focusPath }: { focusPath: readonly string[] }) {
    // e.g. report an analytics event
    // console.log(`focus is updated, the new focusPath is: ${focusPath}`)
}
