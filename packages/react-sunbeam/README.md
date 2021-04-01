<div align="center">
<div align="center"><img src="./logo.svg" width="170" height="170" alt="Sunbeam Logo"/></div>
<h1 align="center">react-sunbeam</h1>
<p>
    Spatial navigation and key press management solution for React apps
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
import { Root, Focusable, FocusManager, useFocusManager } from "react-sunbeam"
import { FocusableCard } from "./FocusableCard"

function App() {
    const { setFocus, moveFocusLeft, moveFocusRight, moveFocusUp, moveFocusDown } = useFocusManager()

    const onKeyDown = useCallback(
        (event) => {
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
    <Root focusManager={focusManager}>
        <App />
    </Root>,
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
import { Root, FocusManager } from "react-sunbeam"
import { App } from "./App"

const focusManager = new FocusManager({
    initialFocusPath: ["menuContainer", "menuItem1"],
})

// Use arrow key presses to control focus.
document.addEventListener("keydown", (event) => {
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
    <Root focusManager={focusManager}>
        <App />
    </Root>,
    document.getElementById("app")
)
```

### `<Root>`

`Root` is the root focusable component.
It instantiates the focusable tree and holds its root node, as well as passing some utilities through React context to other focusable components in the tree.

```ts
function Root(props: {
    focusManager: FocusManager
    keyPressManager?: KeyPressManager
    onFocusUpdate?: (event: { focusPath: FocusPath }) => void
    onKeyPress?: KeyPressListener
    getPreferredChildOnFocus?: CustomGetPreferredChildFn
    children: React.ReactNode
})
```

### `useFocusable()`

A hook that makes the component that uses it a focusable node in the tree.

```ts
function useFocusable(params: {
    // Ref object pointing to a DOM Element or any other object that has 'getBoundingClientRect(): ClientRect' method
    elementRef: Element
    focusKey?: string
    // If set to false the node is ignored in focus management process. Default: true
    focusable?: boolean
    // If set prevents the node from losing focus when navigating in the given directions
    lock?: Direction | Direction[]
    onKeyPress?: KeyPressListener
    onFocus?: (event: FocusEvent) => void
    onBlur?: (event: FocusEvent) => void
    getPreferredChildOnFocus?: CustomGetPreferredChildFn
}): { focused: boolean; path: string[]; node: BranchNode }
```

It can be used both for creating a leaf node or a branch node.
If the latter is the goal, the node has to be passed down the tree through React context.
In order to do that, the user needs to render a Branch component and pass it the opaque `node` object returned from the `useFocusable()` call:

```ts
const { focused, node } = useFocusable(...)

return (
    <Branch node={node}>
        {/*...*/}
    </Branch>
)
```

#### Example: Focusable Button

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

### `<Branch>`

The sole purpose of the `Branch` component is to enable a focusable node to have other focusable children.
The focusable components rendered inside `Branch` will become its focusable children.

```ts
const { focused, node } = useFocusable(...)

return (
    <Branch node={node}>
        ...
    </Branch>
)
```

### `<Focusable>`

### `useFocusManager()`

This hook provides access to some public methods of `FocusManager` inside the React components.
The methods can be used to manipulate focus programmatically.

```ts
function useFocusManager(): {
    setFocus(focusPath: readonly string[]): void
    moveRight(): void
    moveLeft(): void
    moveUp(): void
    moveFocusDown(): void
}
```

### `KeyPressManager`

TODO
