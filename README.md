<div align="center">
<h1 align="center">react-sunbeam</h1>
<h3 align="center">🌅</h3>
<p>
    Spatial navigation and focus management system for React apps  
</p>
<a href="https://app.netlify.com/sites/romantic-wiles-3910cf/deploys"><img src="https://api.netlify.com/api/v1/badges/87d42de3-3413-493d-b30c-c12523a6062a/deploy-status" alt="Netlify Status"></a>
</div>

<p align="center">
      
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
import React, { useCallback, useEffect } from "react"
import { Focusable, SunbeamProvider, FocusManager, useSunbeam } from "react-sunbeam"

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
        </Focusable>
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
```

## API

TODO
