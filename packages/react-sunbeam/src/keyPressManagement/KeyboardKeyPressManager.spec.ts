import { KeyboardKeyPressManager } from "./KeyboardKeyPressManager.js"
import { fireEvent } from "@testing-library/react"

describe("KeyboardKeyPressManager", () => {
    it("should not interfere with propagation of the original keydown event", () => {
        const manager = new KeyboardKeyPressManager()
        const keyboardEvent = new KeyboardEvent("keydown", {
            key: "x",
        })
        const managedListener = jest.fn((event) => event.stopImmediatePropagation())
        const otherListener = jest.fn()

        manager.addKeyDownListener(managedListener)
        window.addEventListener("keydown", otherListener)

        fireEvent(window, keyboardEvent)

        expect(managedListener).toBeCalledTimes(1)
        expect(otherListener).toBeCalledTimes(1)
        window.removeEventListener("keydown", otherListener)
    })

    it("should preventDefault on the original keydown event if the cloned one is event.preventDefault() is called in a listener", () => {
        const manager = new KeyboardKeyPressManager()
        const keyboardEvent = new KeyboardEvent("keydown", {
            key: "x",
            cancelable: true,
        })
        const managedListener = jest.fn((event) => event.preventDefault())
        manager.addKeyDownListener(managedListener)

        fireEvent(window, keyboardEvent)

        expect(managedListener).toBeCalledTimes(1)
        expect(keyboardEvent.defaultPrevented).toBe(true)
    })

    it("should execute the listener from the top of the stack first", () => {
        const manager = new KeyboardKeyPressManager()
        const keyboardEvent = new KeyboardEvent("keydown", {
            key: "x",
        })
        const listener1 = jest.fn()
        const listener2 = jest.fn()
        manager.addKeyDownListener(listener1)
        manager.addKeyDownListener(listener2)

        fireEvent(window, keyboardEvent)

        expect(listener2.mock.invocationCallOrder[0]).toBeLessThan(listener1.mock.invocationCallOrder[0])
        manager.removeAllKeyDownListeners()
    })

    it("should NOT call the next listener in the stack if the current one stops propagation", () => {
        const manager = new KeyboardKeyPressManager()
        const keyboardEvent = new KeyboardEvent("keydown", {
            key: "x",
        })
        const listener1 = jest.fn()
        const listener2 = jest.fn((event) => event.stopPropagation())
        manager.addKeyDownListener(listener1)
        manager.addKeyDownListener(listener2)

        fireEvent(window, keyboardEvent)

        expect(listener1).not.toBeCalled()
        expect(listener2).toBeCalledWith(keyboardEvent)
        manager.removeAllKeyDownListeners()
    })

    it("should remove the key listener while preserving other key listeners in the stack", () => {
        const manager = new KeyboardKeyPressManager()
        const keyboardEvent = new KeyboardEvent("keydown", {
            key: "k",
        })
        const listener1 = jest.fn()
        const listener2 = jest.fn((event) => event.stopPropagation())
        manager.addKeyDownListener(listener1)
        manager.addKeyDownListener(listener2)

        fireEvent(window, keyboardEvent)

        expect(listener1).not.toBeCalledWith(keyboardEvent)
        expect(listener2).toBeCalledWith(keyboardEvent)
        listener1.mockClear()
        listener2.mockClear()

        manager.removeKeyDownListener(listener2)

        fireEvent(window, keyboardEvent)

        expect(listener1).toBeCalledWith(keyboardEvent)
        expect(listener2).not.toBeCalled()
        manager.removeAllKeyDownListeners()
    })

    it("should stop listening to the `keydown` events after `removeAllKeyDownListeners()`", () => {
        const manager = new KeyboardKeyPressManager()
        const keyboardEvent = new KeyboardEvent("keydown", {
            key: "z",
        })
        const listener = jest.fn()
        manager.addKeyDownListener(listener)

        fireEvent(window, keyboardEvent)

        expect(listener).toBeCalledTimes(1)
        expect(listener).toBeCalledWith(keyboardEvent)
        listener.mockClear()

        manager.removeAllKeyDownListeners()
        fireEvent(window, keyboardEvent)

        expect(listener).not.toBeCalled()
    })
})
