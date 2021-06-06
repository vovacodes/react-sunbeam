import * as React from "react"
import { useCallback } from "react"
import { useHistory } from "react-router-dom"

import { defaultGetPreferredChildOnFocus, Direction, IFocusableNode, Focusable, FocusEvent } from "react-sunbeam"

import { ProfilesMenu } from "./ProfilesMenu.js"
import { GamesGallery } from "./GamesGallery.js"
import { NavigationMenu } from "./NavigationMenu.js"
import { Header } from "../../components/Header.js"
import { Colors } from "../../styles.js"
import { Hint } from "../../components/Hint.js"
import { isCancel } from "../../keyPressUtils.js"

export function ConsoleUI() {
    const handleItemFocus = useCallback((_event: FocusEvent) => {
        // console.log(`onFocus: ${path}`)
    }, [])
    const handleItemBlur = useCallback((_event: FocusEvent) => {
        // console.log(`onBlur: ${event.focusablePath.join("->")}`)
    }, [])
    const handleContainerFocus = useCallback((_event: FocusEvent) => {
        // console.log(`onFocus: ${event.focusablePath.join("->")}`)
    }, [])
    const handleContainerBlur = useCallback((_event: FocusEvent) => {
        // console.log(`onBlur: ${event.focusablePath.join("->")}`)
    }, [])

    const history = useHistory()

    return (
        <>
            <Header />
            <div
                style={{
                    height: "100vh",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    position: "relative",
                }}
            >
                <Focusable
                    onKeyDown={(event) => {
                        if (isCancel(event)) {
                            history.goBack()
                        }
                    }}
                    getPreferredChildOnFocus={({
                        focusableChildren,
                        focusOrigin,
                        direction,
                    }: {
                        focusableChildren: Map<string, IFocusableNode>
                        focusOrigin?: IFocusableNode
                        direction?: Direction
                    }) => {
                        if (!focusOrigin || !direction) {
                            // focus the gallery initially
                            if (focusableChildren.has("gamesGallery")) return focusableChildren.get("gamesGallery")
                        }

                        return defaultGetPreferredChildOnFocus({
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
