<div align="center">
<div align="center"><img src="./logo.svg" width="170" height="170" alt="Sunbeam Logo"/></div>
<h1 align="center">React Sunbeam</h1>
<p>
    Spatial navigation and key press management for React apps
</p>
<p align="center">
    <a href="https://sunbeam.vova.codes"><img src="https://img.shields.io/badge/website-3D3D3D?style=flat" alt="npm version" height="18"></a>
    <a href="https://www.npmjs.com/package/react-sunbeam"><img src="https://img.shields.io/npm/v/react-sunbeam?style=flat&colorA=3D3D3D&colorB=3D3D3D" alt="npm version" height="18"></a>
    <a href="https://github.com/vovaguguiev/react-sunbeam/actions?workflow=Test"><img src="https://img.shields.io/github/workflow/status/vovacodes/react-sunbeam/Test?style=flat&colorA=3D3D3D&label=tests&colorB=3D3D3D" alt="Test Status" height="18"></a>
</p>
</div>

```bash
npm install react-sunbeam
```

## 🧐 Why

React Sunbeam provides a flexible and easy-to-use solution for spacial navigation and focus management.
It gives developers an abstraction that can be hooked to any input method the app uses, be it a keyboard, TV remote or gamepad.
There is wide variety of applications that can benefit from React Sunbeam.

### 🎮 TV and Gaming Console Apps

Most of the applications that are running on leanback devices and controlled with a remote or gaming controller need an implementation of directional navigation.
A lot of companies end up rolling out their own custom solutions for that.
Usually those solutions are either very simple, like using column and row indices, or implementing spatial navigation which works much better for the end user but is tricky to implement correctly and hard to maintain.
React Sunbeam provides a well-tested, opensource implementation of spatial navigation that is easy to integrate into any existing React app.

### ⌨️ Web Apps with Keyboard Navigation

React Sunbeam can also be very useful in the regular web apps that want to add support for directional keyboard navigation and thus make this app more accessible to the keyboard-only users.
Spreadsheets and tables, different kinds of dashboards etc, all can benefit from React Sunbeam.

## 🪄 Demo

Try our [demos](https://sunbeam.vova.codes/#demo-selector) on the documentation website to see what kind of interactions you can build with React Sunbeam.

### [Home Screen](https://sunbeam.vova.codes/console-ui)

![demo_home_screen](https://user-images.githubusercontent.com/1524432/113286891-1577a880-92ed-11eb-9119-0d8d4a781180.gif)

### [Setting Menu](https://sunbeam.vova.codes/settings-menu)

![demo_setting_menu](https://user-images.githubusercontent.com/1524432/113286880-114b8b00-92ed-11eb-983f-a2a9086a2042.gif)

## 🎬 Getting Started

**Create a focusable component**

```tsx
import { useFocusable } from "react-sunbeam"

export function Button() {
    const elementRef = useRef(null)
    const { focused } = useFocusable({ elementRef })

    return (
        <button
            ref={elementRef}
            style={{
                // Define the "focused" and "blurred" styling
                border: focused ? "2px solid black" : "none",
            }}
        >
            Click me
        </button>
    )
}
```

**Start managing focus**

```tsx
import { FocusManager, Root } from "react-sunbeam"

// 1. Create a `FocusManager`.
const focusManager = new FocusManager()

// 2. Assign its method calls to an event listener of your choice.
//    This can be a keyboard `keydown` event or your custom code using Gamepad API.
window.addEventListener("keydown", (event) => {
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

// 3. Pass the `focusMananger` instance into the `Root` provider that wraps the rest of your app.
ReactDOM.render(
    <Root focusManager={focusManager}>
        <App />
    </Root>,
    rootElement
)
```

## 🍉 API

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
