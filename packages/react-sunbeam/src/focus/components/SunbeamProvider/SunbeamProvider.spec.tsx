import React from "react"
import { cleanup, render, fireEvent } from "@testing-library/react"
import { FocusManager } from "../.."
import { KeyPressManager } from "../../../keyPressManagement"
import { SunbeamProvider } from "."

describe("<SunbeamProvider>", () => {
    afterEach(cleanup)

    describe("keyPressManager", () => {
        afterEach(cleanup)

        it("should allow to provide a custom instance of KeyPressManager", () => {
            function enterKeyHandler(event: KeyboardEvent) {
                if (event.key === "Enter") event.stopPropagation()
            }
            const existingEnterKeyPressHandler = jest.fn(enterKeyHandler)
            const sunbeamProviderEnterKeyPressHandler = jest.fn(enterKeyHandler)
            const enterKeyPressEvent = new KeyboardEvent("keydown", {
                key: "Enter",
            })
            const focusManager = new FocusManager()
            const keyPressManager = new KeyPressManager()
            keyPressManager.addListener(existingEnterKeyPressHandler)

            render(
                <SunbeamProvider
                    focusManager={focusManager}
                    keyPressManager={keyPressManager}
                    onKeyPress={sunbeamProviderEnterKeyPressHandler}
                >
                    hello
                </SunbeamProvider>
            )

            fireEvent(window, enterKeyPressEvent)
            expect(sunbeamProviderEnterKeyPressHandler).toBeCalledTimes(1)
            expect(sunbeamProviderEnterKeyPressHandler).toBeCalledWith(expect.objectContaining({ key: "Enter" }))
            expect(existingEnterKeyPressHandler).not.toHaveBeenCalled()
            sunbeamProviderEnterKeyPressHandler.mockClear()
            existingEnterKeyPressHandler.mockClear()

            cleanup()

            fireEvent(window, enterKeyPressEvent)
            expect(existingEnterKeyPressHandler).toHaveBeenCalledTimes(1)
            expect(sunbeamProviderEnterKeyPressHandler).not.toHaveBeenCalled()

            keyPressManager.removeAllListeners()
        })

        it("should allow to change the keyPressManager in the subsequent re-renders", async () => {
            function aKeyHandler(event: KeyboardEvent) {
                if (event.key === "a") event.stopPropagation()
            }
            const existingAKeyPressHandler1 = jest.fn(aKeyHandler)
            const sunbeamProviderAKeyPressHandler = jest.fn(aKeyHandler)
            const aKeyPressEvent = new KeyboardEvent("keydown", {
                key: "a",
            })
            const focusManager = new FocusManager()
            const keyPressManager1 = new KeyPressManager()
            keyPressManager1.addListener(existingAKeyPressHandler1)

            const { rerender } = render(
                <SunbeamProvider
                    focusManager={focusManager}
                    keyPressManager={keyPressManager1}
                    onKeyPress={sunbeamProviderAKeyPressHandler}
                >
                    hello
                </SunbeamProvider>
            )

            fireEvent(window, aKeyPressEvent)
            expect(sunbeamProviderAKeyPressHandler).toBeCalledTimes(1)
            expect(sunbeamProviderAKeyPressHandler).toBeCalledWith(expect.objectContaining({ key: "a" }))
            expect(existingAKeyPressHandler1).not.toBeCalled()
            sunbeamProviderAKeyPressHandler.mockClear()

            const keyPressManager2 = new KeyPressManager()
            const existingAKeyPressHandler2 = jest.fn(aKeyHandler)
            keyPressManager2.addListener(existingAKeyPressHandler2)

            rerender(
                <SunbeamProvider
                    focusManager={focusManager}
                    keyPressManager={keyPressManager2}
                    onKeyPress={sunbeamProviderAKeyPressHandler}
                >
                    hello
                </SunbeamProvider>
            )

            fireEvent(window, aKeyPressEvent)
            expect(sunbeamProviderAKeyPressHandler).toBeCalledTimes(1)
            expect(sunbeamProviderAKeyPressHandler).toBeCalledWith(expect.objectContaining({ key: "a" }))
            expect(existingAKeyPressHandler1).toBeCalledTimes(1)
            expect(existingAKeyPressHandler2).not.toBeCalled()
        })
    })

    describe("onKeyPress", () => {
        afterEach(cleanup)

        it("should call the listener", () => {
            const keyPressHandler = jest.fn()
            const keyPressEvent = new KeyboardEvent("keydown")

            const focusManager = new FocusManager()
            render(
                <SunbeamProvider focusManager={focusManager} onKeyPress={keyPressHandler}>
                    hello
                </SunbeamProvider>
            )

            fireEvent(window, keyPressEvent)
            expect(keyPressHandler).toBeCalledTimes(1)
            expect(keyPressHandler).toBeCalledWith(keyPressEvent)
        })

        it("should cleanup the listeners after unmount", () => {
            const keyPressHandler = jest.fn()
            const keyPressEvent = new KeyboardEvent("keydown")

            const focusManager = new FocusManager()
            render(
                <SunbeamProvider focusManager={focusManager} onKeyPress={keyPressHandler}>
                    hello
                </SunbeamProvider>
            )

            fireEvent(window, keyPressEvent)
            expect(keyPressHandler).toBeCalledTimes(1)
            keyPressHandler.mockClear()

            cleanup() // unmount

            fireEvent(window, keyPressEvent)
            expect(keyPressHandler).not.toBeCalled()
        })
    })
})
