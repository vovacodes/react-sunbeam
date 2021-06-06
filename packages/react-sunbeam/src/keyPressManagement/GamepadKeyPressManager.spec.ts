/* eslint-disable @typescript-eslint/no-use-before-define */
import { GamepadKeyPressManager, SyntheticGamepadKeyEvent } from "./GamepadKeyPressManager.js"

describe("GamepadKeyPressManager", () => {
    it("should trigger onKeyDown listener", async () => {
        const gamepad = new FakeGamepad()
        gamepad.connect()
        const manager = new GamepadKeyPressManager(gamepad.id)
        const listener = jest.fn()

        manager.addKeyDownListener(listener)

        // Axes

        gamepad.moveLeftStick(-1, 0)
        await wait(16)
        gamepad.releaseLeftStick()
        await wait(16)

        expect(listener).toBeCalledTimes(1)
        expect(listener).toBeCalledWith(new SyntheticGamepadKeyEvent({ gamepad, axis: 0, value: -1 }))

        listener.mockClear()

        gamepad.moveLeftStick(0, 0.5)
        await wait(16)
        gamepad.releaseLeftStick()
        await wait(16)

        expect(listener).toBeCalledTimes(1)
        expect(listener).toBeCalledWith(new SyntheticGamepadKeyEvent({ gamepad, axis: 1, value: 0.5 }))

        listener.mockClear()

        // Buttons

        gamepad.pressButton(12, 1)
        await wait(16)
        gamepad.releaseButton(12)
        await wait(16)

        expect(listener).toBeCalledTimes(1)
        expect(listener).toBeCalledWith(new SyntheticGamepadKeyEvent({ gamepad, button: 12, value: 1 }))

        manager.removeAllKeyDownListeners()
    })

    it("should execute the listener from the top of the stack first", async () => {
        const gamepad = new FakeGamepad()
        gamepad.connect()
        const manager = new GamepadKeyPressManager(gamepad.id)
        const listener1 = jest.fn()
        const listener2 = jest.fn()

        manager.addKeyDownListener(listener1)
        manager.addKeyDownListener(listener2)

        gamepad.pressButton(10, 1)
        await wait(16)
        gamepad.releaseButton(10)
        await wait(16)

        expect(listener1).toBeCalledTimes(1)
        expect(listener2).toBeCalledTimes(1)
        expect(listener2.mock.invocationCallOrder[0]).toBeLessThan(listener1.mock.invocationCallOrder[0])
        manager.removeAllKeyDownListeners()
    })

    it("should NOT call the next listener in the stack if the current one stops propagation", async () => {
        const gamepad = new FakeGamepad()
        gamepad.connect()
        const manager = new GamepadKeyPressManager(gamepad.id)
        const listener1 = jest.fn()
        const listener2 = jest.fn((event: SyntheticGamepadKeyEvent) => {
            event.stopPropagation()
        })

        manager.addKeyDownListener(listener1)
        manager.addKeyDownListener(listener2)

        gamepad.pressButton(9, 1)
        await wait(16)
        gamepad.releaseButton(9)
        await wait(16)

        expect(listener2).toBeCalledTimes(1)
        expect(listener1).not.toBeCalled()
        manager.removeAllKeyDownListeners()
    })

    it("should remove a listener while preserving other listeners in the stack", async () => {
        const gamepad = new FakeGamepad()
        gamepad.connect()
        const manager = new GamepadKeyPressManager(gamepad.id)
        const listener1 = jest.fn()
        const listener2 = jest.fn()
        manager.addKeyDownListener(listener1)
        manager.addKeyDownListener(listener2)

        gamepad.pressButton(9, 1)
        await wait(16)
        gamepad.releaseButton(9)
        await wait(16)

        expect(listener2).toBeCalledTimes(1)
        expect(listener1).toBeCalledTimes(1)
        listener1.mockClear()
        listener2.mockClear()

        manager.removeKeyDownListener(listener2)

        gamepad.pressButton(9, 1)
        await wait(16)
        gamepad.releaseButton(9)
        await wait(16)

        expect(listener2).not.toBeCalled()
        expect(listener1).toBeCalledTimes(1)
        manager.removeAllKeyDownListeners()
    })

    it("should clear all onKeyDown listeners", async () => {
        const gamepad = new FakeGamepad()
        gamepad.connect()
        const manager = new GamepadKeyPressManager(gamepad.id)
        const listener1 = jest.fn()
        const listener2 = jest.fn()
        manager.addKeyDownListener(listener1)
        manager.addKeyDownListener(listener2)

        gamepad.pressButton(8, 1)
        await wait(16)
        gamepad.releaseButton(8)
        await wait(16)

        expect(listener1).toBeCalledTimes(1)
        expect(listener2).toBeCalledTimes(1)
        listener1.mockClear()
        listener2.mockClear()

        manager.removeAllKeyDownListeners()

        gamepad.pressButton(7, 1)
        await wait(16)
        gamepad.releaseButton(7)
        await wait(16)

        expect(listener1).not.toBeCalled()
        expect(listener2).not.toBeCalled()
    })
})

async function wait(timeoutMs: number) {
    return new Promise((res) => {
        setTimeout(res, timeoutMs)
    })
}

class FakeGamepad implements Gamepad {
    readonly axes: number[] = [0, 0, 0, 0]
    readonly buttons = [
        {
            pressed: false,
            touched: false,
            value: 0,
        },
        {
            pressed: false,
            touched: false,
            value: 0,
        },
        {
            pressed: false,
            touched: false,
            value: 0,
        },
        {
            pressed: false,
            touched: false,
            value: 0,
        },
        {
            pressed: false,
            touched: false,
            value: 0,
        },
        {
            pressed: false,
            touched: false,
            value: 0,
        },
        {
            pressed: false,
            touched: false,
            value: 0,
        },
        {
            pressed: false,
            touched: false,
            value: 0,
        },
        {
            pressed: false,
            touched: false,
            value: 0,
        },
        {
            pressed: false,
            touched: false,
            value: 0,
        },
        {
            pressed: false,
            touched: false,
            value: 0,
        },
        {
            pressed: false,
            touched: false,
            value: 0,
        },
        {
            pressed: false,
            touched: false,
            value: 0,
        },
        {
            pressed: false,
            touched: false,
            value: 0,
        },
        {
            pressed: false,
            touched: false,
            value: 0,
        },
        {
            pressed: false,
            touched: false,
            value: 0,
        },
        {
            pressed: false,
            touched: false,
            value: 0,
        },
    ]
    connected = false
    readonly hand: GamepadHand = ""
    readonly hapticActuators: ReadonlyArray<GamepadHapticActuator> = []
    readonly id: string = "Fake Gamepad"
    readonly index: number = 0
    readonly mapping: GamepadMappingType = "standard"
    readonly pose: GamepadPose | null = null
    timestamp: number

    constructor() {
        this.timestamp = performance.now()
        navigator.getGamepads = () => [this]
    }

    /* Mock interface */

    connect() {
        this.connected = true
    }

    pressButton(idx: number, value?: number) {
        const button = this.buttons[idx]

        button.pressed = true
        button.touched = true
        button.value = value ?? 1

        this.timestamp = performance.now()
    }

    releaseButton(idx: number) {
        const button = this.buttons[idx]

        button.pressed = false
        button.touched = false
        button.value = 0

        this.timestamp = performance.now()
    }

    moveLeftStick(x: number, y: number) {
        this.axes[0] = x
        this.axes[1] = y
    }

    releaseLeftStick() {
        this.axes[0] = 0
        this.axes[1] = 0
    }

    moveRightStick(x: number, y: number) {
        this.axes[2] = x
        this.axes[3] = y
    }

    releaseRightStick() {
        this.axes[2] = 0
        this.axes[3] = 0
    }
}
