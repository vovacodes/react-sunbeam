import * as React from "react"
// @ts-ignore
import { render } from "react-dom/profiling"
// import { render } from "react-dom"
import { BrowserRouter, Route } from "react-router-dom"
import { FocusManager, SunbeamProvider, KeyPressManager } from "react-sunbeam"
import { ConsoleUI } from "./ConsoleUI"
import { SettingsMenu } from "./SettingsMenu"
import { Home } from "./Home"

const focusManager = new FocusManager({
    initialFocusPath: ["gallery", "1"],
})

const keyPressManager = new KeyPressManager()
keyPressManager.addListener((event) => {
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
        <BrowserRouter>
            <Route exact path="/" render={() => <Home />} />
            <Route exact path="/console-ui" render={() => <ConsoleUI />} />
            <Route exact path="/settings-menu" render={() => <SettingsMenu />} />
        </BrowserRouter>
    )
}
