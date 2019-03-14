import * as React from "react"
import { useCallback, useEffect, useState } from "react"
import { render } from "react-dom"
import { Focusable, FocusProvider, FocusManager } from "react-sunbeam"

import { Box } from "./Box"
import { Menu } from "./Menu"
import { Grid } from "./Grid"

interface Props {
    focusManager: FocusManager
}

export function App({ focusManager }: Props) {
    const [selectedItem, setSelectedItem] = useState<string | null>(null)

    const onKeyDown = useCallback(
        (event: Event) => {
            if (!(event instanceof KeyboardEvent)) return

            switch (event.key) {
                case "ArrowRight":
                    focusManager.moveRight()
                    return

                case "ArrowLeft":
                    focusManager.moveLeft()
                    return

                case "ArrowUp":
                    focusManager.moveUp()
                    return

                case "ArrowDown":
                    focusManager.moveDown()
                    return

                case " ":
                case "Enter":
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

    return (
        <Focusable focusKey="app">
            {focused => (
                <div>
                    <div style={{ display: "flex" }}>
                        <Focusable focusKey="navigation">
                            {focused => (
                                <div style={{ display: "flex" }}>
                                    <Focusable focusKey="movies" style={{ margin: "20px" }}>
                                        {focused => (
                                            <Box
                                                focused={focused}
                                                onFocus={() => setSelectedItem("movies")}
                                                color="darkgray"
                                            >
                                                Movies
                                            </Box>
                                        )}
                                    </Focusable>
                                    <Focusable focusKey="series" style={{ margin: "20px" }}>
                                        {focused => (
                                            <Box
                                                focused={focused}
                                                onFocus={() => setSelectedItem("series")}
                                                color="darkgray"
                                            >
                                                Series
                                            </Box>
                                        )}
                                    </Focusable>
                                    <Focusable focusKey="sports" style={{ margin: "20px" }}>
                                        {focused => (
                                            <Box
                                                focused={focused}
                                                onFocus={() => setSelectedItem("sports")}
                                                color="darkgray"
                                            >
                                                Sports
                                            </Box>
                                        )}
                                    </Focusable>
                                    <Focusable focusKey="kids" style={{ margin: "20px" }}>
                                        {focused => (
                                            <Box
                                                focused={focused}
                                                onFocus={() => setSelectedItem("kids")}
                                                color="darkgray"
                                            >
                                                Kids
                                            </Box>
                                        )}
                                    </Focusable>
                                </div>
                            )}
                        </Focusable>
                    </div>
                    <div style={{ display: "flex" }}>
                        <Focusable focusKey="leftMenu">
                            {focused => (
                                <Menu
                                    size={5}
                                    onItemFocus={itemFocusKey => {
                                        setSelectedItem(`leftMenu > ${itemFocusKey}`)
                                    }}
                                />
                            )}
                        </Focusable>
                        <Focusable focusKey="grid">
                            {focused => (
                                <Grid
                                    size={30}
                                    onItemFocus={itemFocusKey => {
                                        setSelectedItem(`grid > ${itemFocusKey}`)
                                    }}
                                />
                            )}
                        </Focusable>
                        <Focusable focusKey="rightMenu">
                            {focused => (
                                <Menu
                                    size={5}
                                    onItemFocus={itemFocusKey => {
                                        setSelectedItem(`rightMenu > ${itemFocusKey}`)
                                    }}
                                />
                            )}
                        </Focusable>
                    </div>
                </div>
            )}
        </Focusable>
    )
}

const focusManager = new FocusManager({
    initialFocusPath: [],
})

render(
    <FocusProvider focusManager={focusManager}>
        <App focusManager={focusManager} />
    </FocusProvider>,
    document.getElementById("app")
)
