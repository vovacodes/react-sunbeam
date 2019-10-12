<div align="center">
<h1 align="center">react-sunbeam</h1>
<h3 align="center">🌅</h3>
<p>
    Spatial navigation and focus management system for React apps
</p>
<p align="center">
    <a href="https://app.netlify.com/sites/romantic-wiles-3910cf/deploys"><img src="https://api.netlify.com/api/v1/badges/87d42de3-3413-493d-b30c-c12523a6062a/deploy-status" alt="Netlify Status"></a>
    <a href="https://badge.fury.io/js/react-sunbeam"><img src="https://badge.fury.io/js/react-sunbeam.svg" alt="npm version" height="18"></a>
</div>
</p>

## Installation

```bash
npm install react-sunbeam
```

or

```bash
yarn add react-sunbeam
```

## Usage

```js
// app.js
import React, { useCallback, useEffect } from "react"
import { Focusable, SunbeamProvider, FocusManager, useSunbeam } from "react-sunbeam"
import { FocusableCard } from "./FocusableCard"

function App() {
    const { setFocus, moveFocusLeft, moveFocusRight, moveFocusUp, moveFocusDown } = useSunbeam()

    const onKeyDown = useCallback(
        event => {
            if (!(event instanceof KeyboardEvent)) return
            switch (event.key) {
                case "ArrowRight":
                    moveFocusRight()
                    return
                case "ArrowLeft":
                    moveFocusLeft()
                    return
                case "ArrowUp":
                    moveFocusUp()
                    return
                case "ArrowDown":
                    moveFocusDown()
                    return
            }
        },
        [focusManager]
    )

    useEffect(() => {
        document.addEventListener("keydown", onKeyDown)
        return () => document.removeEventListener("keydown", onKeyDown)
    }, [onKeyDown])

    return (
        <div>
            <FocusableCard focusKey="card-1" />
            <Focusable focusKey="item1">
                {({ focused }) => <div>{focused ? "I am focused" : "I am not focused"}</div>}
            </Focusable>
            <Focusable focusKey="menuContainer">
                <div>
                    <Focusable focusKey="menuItem1">
                        {({ focused }) => (
                            <div style={{ backgroundColor: focused ? "salmon" : "deepskyblue" }}>
                                You can nest Focusables
                            </div>
                        )}
                    </Focusable>
                    <Focusable focusKey="menuItem2">
                        {({ focused }) => (
                            <div style={{ backgroundColor: focused ? "salmon" : "deepskyblue" }}>
                                In this case Sunbeam will try to find the best candidate for the focus within the common
                                Focusable parent first
                            </div>
                        )}
                    </Focusable>
                </div>
            </Focusable>
            <Focusable focusKey="item2">
                {({ focused, path }) => (
                    <div style={{ textDecoration: focused ? "underline" : "none" }} onClick={() => setFocus(path)}>
                        You can also programmatically change focus by using `setFocus` API
                    </div>
                )}
            </Focusable>
        </div>
    )
}

const focusManager = new FocusManager({
    initialFocusPath: ["menuContainer", "menuItem2"],
})

render(
    <SunbeamProvider focusManager={focusManager}>
        <App />
    </SunbeamProvider>,
    document.getElementById("app")
)

// FocusableCard.js
import React, { useRef } from "react"
import { useFocusable } from "react-sunbeam"

export function FocusableCard({ focusKey }) {
    const elementRef = useRef(null)
    const { focused } = useFocusable({ focusKey, elementRef })

    return (
        <div ref={elementRef} style={{ border: focused ? "1px solid salmon" : "1px solid transparent" }}>
            Card
        </div>
    )
}
```

## API

### `FocusManager`

### `SunbeamProvider`

### `Focusable`

### `useFocusable`

### `KeyPressManager`

TODO
