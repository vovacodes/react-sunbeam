import * as React from "react"
import { render } from "react-dom"
import { BrowserRouter, Route } from "react-router-dom"
import {
    combineKeyPressManagers,
    FocusManager,
    GamepadKeyPressManager,
    KeyboardKeyPressManager,
    Root,
    SyntheticGamepadKeyEvent,
} from "react-sunbeam"
import { ConsoleUI } from "./ConsoleUI/index.js"
import { SettingsMenu } from "./SettingsMenu/index.js"
import { Home } from "./Home/index.js"
import { isDown, isLeft, isRight, isUp, useGamepads, getActiveGamepad } from "../keyPressUtils.js"

const focusManager = new FocusManager()

render(<App />, document.getElementById("app"))

function App() {
    const gamepads = useGamepads()
    const activeGamepadId = getActiveGamepad(gamepads)?.id

    const keyPressManager = React.useMemo(() => {
        if (activeGamepadId) {
            return combineKeyPressManagers(new KeyboardKeyPressManager(), new GamepadKeyPressManager(activeGamepadId))
        }

        return new KeyboardKeyPressManager()
    }, [activeGamepadId])

    React.useEffect(() => {
        keyPressManager.addKeyDownListener((event: KeyboardEvent | SyntheticGamepadKeyEvent) => {
            if (isLeft(event)) {
                focusManager.moveLeft()
            } else if (isRight(event)) {
                focusManager.moveRight()
            } else if (isUp(event)) {
                focusManager.moveUp()
            } else if (isDown(event)) {
                focusManager.moveDown()
            }
        })

        return () => {
            keyPressManager.removeAllKeyDownListeners()
        }
    }, [keyPressManager])

    return (
        <Root focusManager={focusManager} keyPressManager={keyPressManager}>
            <BrowserRouter>
                <Route exact path="/" render={() => <Home />} />
                <Route exact path="/console-ui" render={() => <ConsoleUI />} />
                <Route exact path="/settings-menu" render={() => <SettingsMenu />} />
            </BrowserRouter>
        </Root>
    )
}
