<div align="center">
<div align="center"><img src="https://user-images.githubusercontent.com/1524432/66853526-c8c8d200-ef7f-11e9-8fcf-65da77392158.png" width="170" height="170" alt="Sunbeam Logo"/></div>
<h1 align="center">react-sunbeam</h1>
<p>
    Spatial navigation and focus management system for React apps
</p>
<p align="center">
    <a href="https://github.com/vovaguguiev/react-sunbeam/actions?workflow=Test"><img src="https://github.com/vovaguguiev/react-sunbeam/workflows/Test/badge.svg" alt="Test Status"></a>
    <a href="https://app.netlify.com/sites/romantic-wiles-3910cf/deploys"><img src="https://api.netlify.com/api/v1/badges/87d42de3-3413-493d-b30c-c12523a6062a/deploy-status" alt="Netlify Status"></a>
    <a href="https://www.npmjs.com/package/react-sunbeam"><img src="https://badge.fury.io/js/react-sunbeam.svg" alt="npm version" height="18"></a>
</p>
</div>

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

`FocusManager` is responsible for maintaining the tree of focusable nodes and updating the currently focused node.
Usually, your app will only have a single instance of it which you pass to a `<SunbeamProvider>` component

#### `moveLeft()` / `moveRight()` / `moveUp()` / `moveDown()`

These are the most important methods of `FocusManager`.
They move focus to the nearest focusable node in the corresponding direction.
You can call these methods in response to any events you want: key presses, game controller button presses, scroll events, etc.

#### `setFocus(path: string[]): void`

Immediately makes focused the focusable node with the given `path`.

#### Example

```js
import { render } from "react-dom"
import { SunbeamProvider, FocusManager } from "react-sunbeam"
import { App } from "./App"

const focusManager = new FocusManager({
    initialFocusPath: ["menuContainer", "menuItem1"],
})

// Use arrow key presses to control focus.
document.addEventListener("keydown", event => {
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
        case "Backspace":
            focusManager.setFocus(["carousel", "item-1"])
            return
    }
})

render(
    <SunbeamProvider focusManager={focusManager}>
        <App />
    </SunbeamProvider>,
    document.getElementById("app")
)
```

### `SunbeamProvider`

### `Focusable`

### `useSunbeam(): { setFocus(focusPath: readonly string[]): void; moveFocusRight(): void; moveFocusLeft(): void; moveFocusUp(): void; moveFocusDown(): void; }`

This hook provides access to some public methods of `FocusManager` inside the React components.
It expects `<SunbeamProvider>` to be present in the tree, otherwise it returns no-op versions of the methods

### `useFocusable(options: Options): { focused: boolean; path: string[] }`

This hook makes the enclosing component focusable. It can only be used for the "leaf" focusables so the component
that uses it cannot have other focusable children. If you need the latter behaviour use `<Focusable>` instead.

#### Options

```typescript
type Options = {
    // Ref object pointing to a DOM Element or any other object that has 'getBoundingClientRect(): ClientRect' method
    elementRef: React.RefObject<{ getBoundingClientRect(): ClientRect }>
    // If set to false the node is ignored in focus management process. Default: true
    focusable?: boolean
    focusKey?: string
    onKeyPress?: (event: KeyboardEvent) => void
    onFocus?: (event: { focusablePath: readonly string[]; getBoundingClientRect: () => ClientRect }) => void
    onBlur?: (event: { focusablePath: readonly string[]; getBoundingClientRect: () => ClientRect }) => void
}
```

#### Example

```typescript jsx
import React from "react"
import { useFocusable } from "react-sunbeam"

export function FocusableButton({ children }) {
    const ref = React.useRef<HTMLButtonElement>(null)
    const { focused } = useFocusable({
        elementRef: ref,
        onKeyPress(event) {
            if (event.key === "Enter") {
                event.stopPropagation()
                alert("Click!")
            }
        },
    })

    return (
        <button style={{ border: focused ? "2px solid black" : "2px solid transparent" }} ref={ref}>
            {children}
        </button>
    )
}
```

### `KeyPressManager`

TODO
