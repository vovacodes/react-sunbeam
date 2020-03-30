import * as React from "react"
import { useCallback } from "react"
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
import { Header } from "../../components/Header"
import { Colors } from "../../styles"
import { Hint } from "../../components/Hint"

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
        <>
            <Header />
            <div
                style={{
                    height: "calc(100vh - 80px)",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    position: "relative",
                }}
            >
                <Focusable
                    onKeyPress={(event) => {
                        if (event.key !== "Backspace" && event.key !== "Escape") return

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

                        return unstable_defaultGetPreferredChildOnFocusReceive({
                            focusableChildren,
                            focusOrigin,
                            direction,
                        })
                    }}
                >
                    <div
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "space-between",
                            height: "563px",
                            width: "1000px",
                            boxSizing: "border-box",
                            padding: "60px 95px",
                            border: `2px solid ${Colors.textBlack}`,
                            overflow: "hidden",
                        }}
                    >
                        <ProfilesMenu
                            onFocus={handleContainerFocus}
                            onBlur={handleContainerBlur}
                            onItemFocus={handleItemFocus}
                            onItemBlur={handleItemBlur}
                        />
                        <div style={{ alignSelf: "center" }}>
                            <GamesGallery
                                onFocus={handleContainerFocus}
                                onBlur={handleContainerBlur}
                                onItemFocus={handleItemFocus}
                                onItemBlur={handleItemBlur}
                            />
                        </div>
                        <div style={{ alignSelf: "center" }}>
                            <NavigationMenu
                                onFocus={handleContainerFocus}
                                onBlur={handleContainerBlur}
                                onItemFocus={handleItemFocus}
                                onItemBlur={handleItemBlur}
                            />
                        </div>
                    </div>
                </Focusable>
            </div>
            <Hint>
                <div>
                    Navigation - <b>{"↑"}</b> <b>{"↓"}</b> <b>{"<-"}</b> <b>{"->"}</b>
                </div>
                <div>
                    Go back - <b>Esc</b> or <b>Backspace</b>
                </div>
                <div>
                    Immediately focus item - <b>Click</b>
                </div>
            </Hint>
        </>
    )
}
