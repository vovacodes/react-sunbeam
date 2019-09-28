import * as React from "react"
import { useCallback, useEffect, useState } from "react"
import { render } from "react-dom"
import {
    Direction,
    Focusable,
    FocusableTreeNode,
    FocusEvent,
    FocusManager,
    SunbeamProvider,
    unstable_defaultGetPreferredChildOnFocusReceive,
    useSunbeam,
} from "react-sunbeam"

import { ProfilesMenu } from "./ProfilesMenu"
import { GamesGallery } from "./GamesGallery"
import { NavigationMenu } from "./NavigationMenu"

export function App() {
    const [selectedItem, setSelectedItem] = useState<string | null>(null)
    const [screen, setScreen] = useState("home")

    const { moveFocusLeft, moveFocusRight, moveFocusUp, moveFocusDown } = useSunbeam()
    const onKeyDown = useCallback(
        (event: Event) => {
            if (!(event instanceof KeyboardEvent)) return

            switch (event.key) {
                case "ArrowRight":
                    event.preventDefault()
                    moveFocusRight()
                    return

                case "ArrowLeft":
                    event.preventDefault()
                    moveFocusLeft()
                    return

                case "ArrowUp":
                    event.preventDefault()
                    moveFocusUp()
                    return

                case "ArrowDown":
                    event.preventDefault()
                    moveFocusDown()
                    return

                case " ":
                case "Enter":
                    event.preventDefault()
                    if (screen !== "detail") setScreen("detail")
                    return
                case "Backspace":
                    event.preventDefault()
                    if (screen !== "home") setScreen("home")
                    return
            }
        },
        [focusManager, selectedItem, screen]
    )
    useEffect(() => {
        document.addEventListener("keydown", onKeyDown)

        return () => document.removeEventListener("keydown", onKeyDown)
    }, [onKeyDown])

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
                <Focusable focusKey="detail-focusable" style={{ display: "flex" }}>
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
    )
}

const focusManager = new FocusManager({
    initialFocusPath: ["gallery", "1"],
})

function handleFocusUpdate({ focusPath }) {
    // e.g. report an analytics event
    // console.log(`focus is updated, the new focusPath is: ${focusPath}`)
}

render(
    <SunbeamProvider
        focusManager={focusManager}
        onFocusUpdate={handleFocusUpdate}
        // unstable_passFocusBetweenChildren={({ focusableChildren, focusOrigin, direction }) => {
        //     if (direction === "LEFT" || direction === "RIGHT") {
        //         return "KEEP_FOCUS_UNCHANGED"
        //     }
        //
        //     return unstable_defaultPassFocusBetweenChildren({focusableChildren, focusOrigin, direction})
        // }}
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
