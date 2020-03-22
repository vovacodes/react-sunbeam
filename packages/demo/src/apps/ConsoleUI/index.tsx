import * as React from "react"
import { useHistory } from "react-router-dom"
import {
    Direction,
    Focusable,
    FocusableTreeNode,
    FocusEvent,
    unstable_defaultGetPreferredChildOnFocusReceive,
} from "react-sunbeam"

import { ProfilesMenu } from "./ProfilesMenu"
import { GamesGallery } from "./GamesGallery"
import { NavigationMenu } from "./NavigationMenu"
import { useCallback } from "react"

export function ConsoleUI() {
    const handleItemFocus = useCallback((event: FocusEvent) => {
        // console.log(`onFocus: ${path}`)
    }, [])
    const handleItemBlur = useCallback((event: FocusEvent) => {
        // console.log(`onBlur: ${event.focusablePath.join("->")}`)
    }, [])
    const handleContainerFocus = useCallback((event: FocusEvent) => {
        // console.log(`onFocus: ${event.focusablePath.join("->")}`)
    }, [])
    const handleContainerBlur = useCallback((event: FocusEvent) => {
        // console.log(`onBlur: ${event.focusablePath.join("->")}`)
    }, [])

    const history = useHistory()

    return (
        <Focusable
            onKeyPress={event => {
                if (event.key !== "Backspace") return

                history.goBack()
            }}
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
