import * as React from "react"
import { SyntheticGamepadKeyEvent } from "react-sunbeam"

const JoyConSplitMapping = {
    ids: [
        // Chrome
        "Joy-Con (L) (STANDARD GAMEPAD Vendor: 057e Product: 2006)",
        "Joy-Con (R) (STANDARD GAMEPAD Vendor: 057e Product: 2007)",
        // Safari
        "57e-2006-Joy-Con (L)",
        "57e-2007-Joy-Con (R)",
    ],
    buttons: {
        0: "B",
        1: "A",
        2: "Y",
        3: "X",
        4: "SL",
        5: "SR",
    } as const,
    axes: {
        0: "LStick Horizontal",
        1: "LStick Vertical",
    } as const,
}

const JoyConJoinedMapping = {
    ids: [
        // Chrome
        "Joy-Con L+R (STANDARD GAMEPAD Vendor: 057e Product: 200e)",
        // Safari
        " Extended Gamepad",
    ],
    buttons: {
        0: "B",
        1: "A",
        2: "Y",
        3: "X",
        4: "L",
        5: "R",
        6: "ZL",
        7: "ZR",
        8: "-",
        9: "+",
        12: "DPad Up",
        13: "DPad Down",
        14: "DPad Left",
        15: "DPad Right",
    } as const,
    axes: {
        0: "LStick Horizontal",
        1: "LStick Vertical",
        2: "RStick Horizontal",
        3: "RStick Vertical",
    } as const,
}

type Values<T> = T[keyof T]

export function getSwitchGamepadButtonLabel(
    gamepadId: string,
    index: number | undefined
): Values<typeof JoyConJoinedMapping.buttons> | Values<typeof JoyConSplitMapping.buttons> | undefined {
    if (index === undefined) return undefined

    if (JoyConSplitMapping.ids.includes(gamepadId)) {
        return JoyConSplitMapping.buttons[index as keyof typeof JoyConSplitMapping.buttons]
    }

    return JoyConJoinedMapping.buttons[index as keyof typeof JoyConJoinedMapping.buttons]
}

export function getSwitchGamepadAxisLabel(
    gamepadId: string,
    index: number | undefined
): Values<typeof JoyConJoinedMapping.axes> | Values<typeof JoyConSplitMapping.axes> | undefined {
    if (index === undefined) return undefined

    if (JoyConSplitMapping.ids.includes(gamepadId)) {
        return JoyConSplitMapping.axes[index as keyof typeof JoyConSplitMapping.axes]
    }

    return JoyConJoinedMapping.axes[index as keyof typeof JoyConJoinedMapping.axes]
}

export function isLeft(event: KeyboardEvent | SyntheticGamepadKeyEvent) {
    if (event instanceof KeyboardEvent) {
        return event.key === "ArrowLeft"
    }

    if (
        (getSwitchGamepadAxisLabel(event.gamepad.id, event.axis) === "LStick Horizontal" ||
            getSwitchGamepadAxisLabel(event.gamepad.id, event.axis) === "RStick Horizontal") &&
        event.value < 0
    )
        return true
    if (getSwitchGamepadButtonLabel(event.gamepad.id, event.button) === "DPad Left" && event.value > 0) return true

    return false
}

export function isRight(event: KeyboardEvent | SyntheticGamepadKeyEvent) {
    if (event instanceof KeyboardEvent) {
        return event.key === "ArrowRight"
    }

    if (
        (getSwitchGamepadAxisLabel(event.gamepad.id, event.axis) === "LStick Horizontal" ||
            getSwitchGamepadAxisLabel(event.gamepad.id, event.axis) === "RStick Horizontal") &&
        event.value > 0
    )
        return true
    if (getSwitchGamepadButtonLabel(event.gamepad.id, event.button) === "DPad Right" && event.value > 0) return true

    return false
}

export function isUp(event: KeyboardEvent | SyntheticGamepadKeyEvent) {
    if (event instanceof KeyboardEvent) {
        return event.key === "ArrowUp"
    }

    if (
        (getSwitchGamepadAxisLabel(event.gamepad.id, event.axis) === "LStick Vertical" ||
            getSwitchGamepadAxisLabel(event.gamepad.id, event.axis) === "RStick Vertical") &&
        event.value < 0
    )
        return true
    if (getSwitchGamepadButtonLabel(event.gamepad.id, event.button) === "DPad Up" && event.value > 0) return true
    return false
}

export function isDown(event: KeyboardEvent | SyntheticGamepadKeyEvent) {
    if (event instanceof KeyboardEvent) {
        return event.key === "ArrowDown"
    }

    if (
        (getSwitchGamepadAxisLabel(event.gamepad.id, event.axis) === "LStick Vertical" ||
            getSwitchGamepadAxisLabel(event.gamepad.id, event.axis) === "RStick Vertical") &&
        event.value > 0
    )
        return true
    if (getSwitchGamepadButtonLabel(event.gamepad.id, event.button) === "DPad Down" && event.value > 0) return true
    return false
}

export function isSelect(event: KeyboardEvent | SyntheticGamepadKeyEvent) {
    if (event instanceof KeyboardEvent) {
        return event.key === "Enter" || event.key === " "
    }

    return getSwitchGamepadButtonLabel(event.gamepad.id, event.button) === "B"
}

export function isCancel(event: KeyboardEvent | SyntheticGamepadKeyEvent) {
    if (event instanceof KeyboardEvent) {
        return event.key === "Backspace" || event.key === "Escape"
    }

    return getSwitchGamepadButtonLabel(event.gamepad.id, event.button) === "Y"
}

export function useGamepads(): Gamepad[] {
    const [gamepads, setGamepads] = React.useState(
        () => Array.from(navigator.getGamepads()).filter(Boolean) as Gamepad[]
    )

    React.useEffect(() => {
        window.addEventListener("gamepadconnected", handleGamepadsUpdate)
        window.addEventListener("gamepaddisconnected", handleGamepadsUpdate)
        function handleGamepadsUpdate() {
            setGamepads(Array.from(navigator.getGamepads()).filter(Boolean) as Gamepad[])
        }

        return () => {
            window.removeEventListener("gamepadconnected", handleGamepadsUpdate)
            window.removeEventListener("gamepaddisconnected", handleGamepadsUpdate)
        }
    }, [setGamepads])

    return gamepads
}

export function getActiveGamepad(gamepads: Gamepad[]): Gamepad | undefined {
    const joyCon = gamepads.find(
        (gamepad) =>
            [
                "Joy-Con (L) (STANDARD GAMEPAD Vendor: 057e Product: 2006)",
                "Joy-Con (R) (STANDARD GAMEPAD Vendor: 057e Product: 2007)",
            ].includes(gamepad.id) || ["Joy-Con L+R (STANDARD GAMEPAD Vendor: 057e Product: 200e)"].includes(gamepad.id)
    )
    if (joyCon) return joyCon

    return gamepads[0] ?? undefined
}
