import * as React from "react"
import { useCallback, useState, useRef } from "react"
import { render } from "react-dom"
import { FocusManager, SunbeamProvider, KeyPressManager, useFocusable, Focusable } from "../react-sunbeam"
import Item from "./StyledFocusItem"
import HorizontalList from "./HorizontalList"
import VerticalList from "./VerticalList"
// import FocusLock from "./FocusLock"
import customStrategy from "./customStrategy"
import AutoFocus from "./AutoFocus"
import FocusLock from "./FocusLock"
import FocusIgnore from "./FocusIgnore"

const focusManager = new FocusManager({
    initialFocusPath: [
        "#vertical#root_vertical",
        "#vertical#vertical_list_1",
        "#horizontal#horizontal_list",
        "sub_horizontal_1",
    ],
    // initialFocusPath: [
    //     "#vertical#root_vertical",
    //     "#vertical#vertical_list_1",
    //     "#vertical#expandable-list",
    //     "sub_item_1",
    // ],
    strategy: customStrategy,
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
    <SunbeamProvider focusManager={focusManager} keyPressManager={keyPressManager}>
        <App />
    </SunbeamProvider>,
    document.getElementById("app")
)

function App() {
    return (
        <VerticalList focusKey="root_vertical">
            <AppBody />
        </VerticalList>
    )
}

function AppBody() {
    const [added, setAdded] = useState(false)
    const toggleAdded = useCallback(() => setAdded(a => !a), [setAdded])
    const [ignore, setIgnore] = useState(false)
    const toggleIgnore = useCallback(() => setIgnore(a => !a), [setIgnore])

    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
            }}
        >
            <button onClick={toggleAdded}>Add Dynami</button>
            <button onClick={toggleIgnore}>Ignore</button>
            <HorizontalList
                focusKey="horizontal_list"
                style={{ marginTop: "32px", marginLeft: "60px", display: "flex" }}
            >
                <HorizontalBody />
            </HorizontalList>

            <div style={{ marginTop: "94px" }}>
                <VerticalList focusKey="vertical_list_1">
                    <VerticalMainBody added={added} ignore={ignore} />
                </VerticalList>
            </div>
        </div>
    )
}

function HorizontalBody() {
    return (
        <>
            <Item focusKey="horizontal_1" />
            <Item focusKey="horizontal_2" />
        </>
    )
}

function VerticalMainBody({ added, ignore }: { added: boolean; ignore: boolean }) {
    return (
        <>
            <Item focusKey="vertical_item_1" />
            <Item focusKey="vertical_item_2" />
            <ExpandableSection />
            <Item focusKey="third" />
            {added && <Item focusKey="dynamically added" />}
            <HorizontalList
                focusKey="horizontal_list"
                style={{ marginTop: "16px", marginLeft: "60px", display: "flex" }}
            >
                <SubHorizontalBody />
            </HorizontalList>
            <IgnoreSection ignore={ignore} />
            <Item focusKey="forth" />
        </>
    )
}

function IgnoreSection({ ignore }: { ignore: boolean }) {
    return (
        <div style={{ color: ignore ? "#c2d5cc" : undefined }}>
            <FocusIgnore active={ignore} focusKey="ignore-container">
                <Item focusKey="ignore-1" />
                <Item focusKey="ignore-2" />
            </FocusIgnore>
        </div>
    )
}

function ExpandableSection() {
    const [expanded, setExpanded] = useState(false)
    const onExpandablePress = useCallback(event => {
        if (event.key === "Enter") {
            setExpanded(true)
        } else if (event.key === "Backspace") {
            setExpanded(false)
        }
    }, [])
    return (
        <VerticalList focusKey="expandable-list" onKeyPress={onExpandablePress}>
            <Item focusKey="expandable" />
            {expanded && (
                <FocusLock focusKey="my-only-lock">
                    <AutoFocus focusKey="autofocus-subgroup" style={{ marginLeft: 20 }}>
                        <Item focusKey="sub_item_1" />
                        <Item focusKey="sub_item_2" />
                        <Item focusKey="sub_item_3" />
                    </AutoFocus>
                </FocusLock>
            )}
        </VerticalList>
    )
}

function SubHorizontalBody() {
    return (
        <>
            <Item focusKey="sub_horizontal_1" />
            <Item focusKey="sub_horizontal_2" />
            <Item focusKey="sub_horizontal_3" />
        </>
    )
}
