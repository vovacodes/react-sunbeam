import { KeyPressManager } from "./KeyPressManager"
import { fireEvent } from "@testing-library/react"

describe("KeyPressManager", () => {
    it("should add the listener only for the specified key", () => {
        const manager = new KeyPressManager()
        const keyboardEvent1 = new KeyboardEvent("keydown", {
            key: "a",
        })
        const keyboardEvent2 = new KeyboardEvent("keydown", {
            key: "y",
        })
        const listener = jest.fn()
        manager.addListener("a", listener)

        fireEvent(window, keyboardEvent1)

        expect(listener).toBeCalledWith(keyboardEvent1)
        listener.mockClear()

        fireEvent(window, keyboardEvent2)

        expect(listener).not.toBeCalled()
        manager.teardown()
    })

    it("should only execute the listener from the top of the stack", () => {
        const manager = new KeyPressManager()
        const keyboardEvent = new KeyboardEvent("keydown", {
            key: "x",
        })
        const listener1 = jest.fn()
        const listener2 = jest.fn()
        manager.addListener("x", listener1)
        manager.addListener("x", listener2)

        fireEvent(window, keyboardEvent)

        expect(listener1).not.toBeCalled()
        expect(listener2).toBeCalledWith(keyboardEvent)
        manager.teardown()
    })

    it("should call the next listener in the stack if the current one returns `true`", () => {
        const manager = new KeyPressManager()
        const keyboardEvent = new KeyboardEvent("keydown", {
            key: "x",
        })
        const listener1 = jest.fn()
        const listener2 = jest.fn(() => true)
        manager.addListener("x", listener1)
        manager.addListener("x", listener2)

        fireEvent(window, keyboardEvent)

        expect(listener1).toBeCalledWith(keyboardEvent)
        expect(listener2).toBeCalledWith(keyboardEvent)
        manager.teardown()
    })

    it("should remove the key listener while preserving other key listeners in the stack", () => {
        const manager = new KeyPressManager()
        const keyboardEvent1 = new KeyboardEvent("keydown", {
            key: "k",
        })
        const keyboardEvent2 = new KeyboardEvent("keydown", {
            key: "k",
        })
        const listener1 = jest.fn()
        const listener2 = jest.fn()
        manager.addListener("k", listener1)
        manager.addListener("k", listener2)

        fireEvent(window, keyboardEvent1)

        expect(listener1).not.toBeCalledWith(keyboardEvent1)
        expect(listener2).toBeCalledWith(keyboardEvent1)
        listener1.mockClear()
        listener2.mockClear()

        manager.removeListener("k", listener2)

        fireEvent(window, keyboardEvent2)

        expect(listener1).toBeCalledWith(keyboardEvent2)
        expect(listener2).not.toBeCalled()
        manager.teardown()
    })

    it("should stop listening to the `keydown` events after `teardown()`", () => {
        const manager = new KeyPressManager()
        const keyboardEvent = new KeyboardEvent("keydown", {
            key: "z",
        })
        const listener = jest.fn()
        manager.addListener("z", listener)

        fireEvent(window, keyboardEvent)

        expect(listener).toBeCalledTimes(1)
        expect(listener).toBeCalledWith(keyboardEvent)
        listener.mockClear()

        manager.teardown()
        fireEvent(window, keyboardEvent)

        expect(listener).not.toBeCalled()
    })
})
