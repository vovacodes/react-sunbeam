import * as React from "react"
import { useCallback, useState } from "react"
import { render } from "react-dom"
import { FocusManager, SunbeamProvider, KeyPressManager } from "../react-sunbeam"
import Item from "./StyledFocusItem"
import HorizontalList from "./HorizontalList"
import VerticalList from "./VerticalList"
// import FocusLock from "./FocusLock"
import customStrategy from "./customStrategy"

const focusManager = new FocusManager({
    initialFocusPath: [
        "#vertical#root_vertical",
        "#vertical#vertical_list_1",
        "#horizontal#horizontal_list",
        "sub_horizontal_1",
    ],
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
    const [expanded, setExpanded] = useState(false)

    return (
        <VerticalList focusKey="root_vertical">
            <AppBody />
        </VerticalList>
    )
}

function AppBody() {
    const [added, setAdded] = useState(false)
    const toggleAdded = useCallback(() => setAdded(a => !a), [setAdded])
    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
            }}
        >
            <button onClick={toggleAdded}>Add Dynami</button>
            <HorizontalList
                focusKey="horizontal_list"
                style={{ marginTop: "32px", marginLeft: "60px", display: "flex" }}
            >
                <HorizontalBody />
            </HorizontalList>

            <div style={{ marginTop: "94px" }}>
                <VerticalList focusKey="vertical_list_1">
                    <VerticalMainBody added={added} />
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

function VerticalMainBody({ added }: { added: boolean }) {
    return (
        <>
            <Item focusKey="vertical_item_1" />
            <Item focusKey="vertical_item_2" />
            <Item focusKey="expandable" />
            <Item focusKey="third" />
            {added && <Item focusKey="dynamically added" />}
            <HorizontalList
                focusKey="horizontal_list"
                style={{ marginTop: "16px", marginLeft: "60px", display: "flex" }}
            >
                <SubHorizontalBody />
            </HorizontalList>
            <Item focusKey="forth" />
        </>
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
