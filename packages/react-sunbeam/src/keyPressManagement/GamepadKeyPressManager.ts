import type { KeyPressManager } from "./types.js"
import { assert } from "../shared/assert.js"

const PRESS_THRESHOLD = 0.5

interface AxisEventData {
    gamepad: Gamepad
    axis: 0 | 1 | 2 | 3
    value: number
}

interface ButtonEventData {
    gamepad: Gamepad
    button: number
    value: number
}

type GamepadKeyEventData = AxisEventData | ButtonEventData

export class SyntheticGamepadKeyEvent extends Event {
    public gamepad: Gamepad
    public axis?: number
    public button?: number
    public value: number

    constructor(data: GamepadKeyEventData) {
        super("SyntheticGamepadKeyEvent", { bubbles: false, cancelable: true, composed: false })

        this.gamepad = data.gamepad

        if ("axis" in data) {
            this.axis = data.axis
        }
        if ("button" in data) {
            this.button = data.button
        }

        this.value = data.value
    }
}

export type GamepadKeyPressListener = (event: SyntheticGamepadKeyEvent) => void

/**
 * NOTE: This implementation is experimental and can change without a notice.
 */
export class GamepadKeyPressManager implements KeyPressManager<SyntheticGamepadKeyEvent> {
    /**
     * List of the event keyDownListeners to notify when an event happens.
     * We use `null` as the "uninitialized" state, meaning that the underlying gamepad event listener
     * hasn't been registered yet.
     */
    private keyDownListeners: GamepadKeyPressListener[] | null = null

    public connected: boolean

    constructor(private gamepadId: string) {
        this.connected = Boolean([...navigator.getGamepads()].find((g) => g?.id === gamepadId)?.connected)

        window.addEventListener("gamepadconnected", this.handleGamepadsUpdate)
        window.addEventListener("gamepaddisconnected", this.handleGamepadsUpdate)
    }

    public addKeyDownListener(listener: GamepadKeyPressListener): void {
        let needsInitialization = false

        if (!this.keyDownListeners) {
            this.keyDownListeners = []
            needsInitialization = true
        }

        this.keyDownListeners.unshift(listener)

        if (needsInitialization) {
            this.startGamepadStatePolling()
        }
    }

    public removeKeyDownListener(listener: GamepadKeyPressListener): void {
        if (!this.keyDownListeners) return

        const index = this.keyDownListeners.indexOf(listener)
        if (index === -1) return

        this.keyDownListeners.splice(index, 1)

        if (this.keyDownListeners.length === 0) {
            this.stopGamepadStatePolling()
            this.keyDownListeners = null
        }
    }

    public removeAllKeyDownListeners(): void {
        this.stopGamepadStatePolling()
        this.keyDownListeners = null
    }

    private notifyKeyDownListeners(event: SyntheticGamepadKeyEvent): void {
        if (!this.keyDownListeners) return

        // go through the keyDownListeners as long as the event propagation is not cancelled
        for (const keyDownListener of this.keyDownListeners) {
            keyDownListener(event)
            if (event.cancelBubble) break
        }
    }

    private handleGamepadsUpdate = () => {
        this.connected = Boolean([...navigator.getGamepads()].find((g) => g?.id === this.gamepadId)?.connected)

        if (this.connected && this.rafId === null) {
            this.startGamepadStatePolling()
        }
    }

    public disconnect() {
        this.connected = false

        this.stopGamepadStatePolling()

        window.removeEventListener("gamepadconnected", this.handleGamepadsUpdate)
        window.removeEventListener("gamepaddisconnected", this.handleGamepadsUpdate)
    }

    private getGamepad(): Gamepad {
        const gamepad = [...navigator.getGamepads()].find((g) => g?.id === this.gamepadId)

        assert(gamepad, `cannot find a gamepad with id ${this.gamepadId}`)

        return gamepad
    }

    private rafId: number | null = null

    private startGamepadStatePolling(): void {
        if (this.rafId !== null) return

        // Initialize `this.rafId` with an arbitrary number to prevent `this.pollGamepadState`
        // from thinking it was already cancelled.
        this.rafId = 1
        this.pollGamepadState()
    }

    private stopGamepadStatePolling(): void {
        if (this.rafId === null) return

        cancelAnimationFrame(this.rafId)
        this.rafId = null
    }

    private pressed = {
        axes: [false, false, false, false] as [boolean, boolean, boolean, boolean],
        buttons: [] as boolean[],
    }

    private pollGamepadState = () => {
        if (this.rafId === null) {
            // Polling was already cancelled.
            return
        }

        if (!this.connected) {
            this.stopGamepadStatePolling()
            return
        }

        const gamepad = this.getGamepad()
        gamepad.axes.forEach((value, index) => {
            // Make typescript happy.
            if (index !== 0 && index !== 1 && index !== 2 && index !== 3) {
                // We only support 4 axes (2 analog sticks).
                return
            }

            if (Math.abs(value) >= PRESS_THRESHOLD && !this.pressed.axes[index]) {
                this.pressed.axes[index] = true
                this.notifyKeyDownListeners(new SyntheticGamepadKeyEvent({ gamepad, axis: index, value }))
                return
            }

            if (Math.abs(value) < PRESS_THRESHOLD && this.pressed.axes[index]) {
                this.pressed.axes[index] = false
                // TODO: trigger onKeyUp
                // this.notifyKeyDownListeners(new SyntheticGamepadKeyEvent({ axis: index, value }))
                return
            }
        })

        gamepad.buttons.forEach(({ value }, index) => {
            if (value >= PRESS_THRESHOLD && !this.pressed.buttons[index]) {
                this.pressed.buttons[index] = true
                this.notifyKeyDownListeners(new SyntheticGamepadKeyEvent({ gamepad, button: index, value }))
                return
            }

            if (value < PRESS_THRESHOLD && this.pressed.buttons[index]) {
                this.pressed.buttons[index] = false
                // TODO: trigger onKeyUp
                // this.notifyKeyDownListeners(new SyntheticGamepadKeyEvent({ button: index, value }))
                return
            }
        })

        this.rafId = requestAnimationFrame(this.pollGamepadState)
    }
}
