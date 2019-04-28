import * as React from "react"
import { useCallback, useEffect, useState } from "react"
import { render } from "react-dom"
import { SunbeamProvider, FocusManager, useSunbeam } from "react-sunbeam"

import { ProfilesMenu } from "./ProfilesMenu"
import { GamesGallery } from "./GamesGallery"
import { NavigationMenu } from "./NavigationMenu"
import { FocusEvent } from "./FocusableItem"

export function App() {
    const [selectedItem, setSelectedItem] = useState<string | null>(null)

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
                    alert(`Selected item: ${selectedItem}`)
                    return
            }
        },
        [focusManager, selectedItem]
    )
    useEffect(() => {
        document.addEventListener("keydown", onKeyDown)

        return () => document.removeEventListener("keydown", onKeyDown)
    }, [onKeyDown])

    const handleItemFocus = useCallback(
        (event: FocusEvent) => {
            setSelectedItem(event.focusPath.join("->"))
        },
        [setSelectedItem]
    )

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
                <ProfilesMenu onItemFocus={handleItemFocus} />
            </div>
            <div style={{ marginTop: "94px", alignSelf: "center" }}>
                <GamesGallery onItemFocus={handleItemFocus} />
            </div>
            <div style={{ marginTop: "94px", alignSelf: "center" }}>
                <NavigationMenu onItemFocus={handleItemFocus} />
            </div>
        </div>
    )
}

const focusManager = new FocusManager({
    initialFocusPath: [],
})

render(
    <SunbeamProvider focusManager={focusManager}>
        <App />
    </SunbeamProvider>,
    document.getElementById("app")
)
