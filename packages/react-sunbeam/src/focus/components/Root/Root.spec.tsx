import React from "react"
import { act, render, fireEvent } from "@testing-library/react"
import { Focusable, FocusManager } from "../../index.js"
import { KeyboardKeyPressManager } from "../../../keyPressManagement/index.js"
import { Root } from "./index.js"

describe("<Root>", () => {
    it("should call focusManager.revalidateFocusPath() only once when multiple nodes are added/removed from the tree", async () => {
        const focusManager = new FocusManager()
        const spy = jest.spyOn(focusManager, "revalidateFocusPath")

        const { rerender } = render(
            <Root focusManager={focusManager}>
                <Focusable>left</Focusable>
                <Focusable>
                    <Focusable>right</Focusable>
                </Focusable>
            </Root>
        )

        expect(spy).toBeCalledTimes(1)
        spy.mockReset()

        rerender(
            <Root focusManager={focusManager}>
                <Focusable>left</Focusable>
                {/* Removed right subtree */}
            </Root>
        )
        await act(() => Promise.resolve())

        expect(spy).toBeCalledTimes(1)
        spy.mockRestore()
    })

    describe("getPreferredChildOnFocus", () => {
        it("selects which child to focus on when Root becomes focused", () => {
            const focusManager = new FocusManager()

            render(
                <Root
                    focusManager={focusManager}
                    getPreferredChildOnFocus={({ focusableChildren }) => {
                        return focusableChildren.get("right")
                    }}
                >
                    <Focusable>left</Focusable>
                    <Focusable focusKey="right">right</Focusable>
                </Root>
            )

            expect(focusManager.getFocusPath()).toEqual(["right"])
        })
    })

    describe("keyPressManager", () => {
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
            const keyPressManager = new KeyboardKeyPressManager()
            keyPressManager.addKeyDownListener(existingEnterKeyPressHandler)

            const { rerender } = render(
                <Root
                    focusManager={focusManager}
                    keyPressManager={keyPressManager}
                    onKeyDown={sunbeamProviderEnterKeyPressHandler}
                >
                    hello
                </Root>
            )

            fireEvent(window, enterKeyPressEvent)
            expect(sunbeamProviderEnterKeyPressHandler).toBeCalledTimes(1)
            expect(sunbeamProviderEnterKeyPressHandler).toBeCalledWith(expect.objectContaining({ key: "Enter" }))
            expect(existingEnterKeyPressHandler).not.toHaveBeenCalled()
            sunbeamProviderEnterKeyPressHandler.mockClear()
            existingEnterKeyPressHandler.mockClear()

            // unmount
            rerender(<div />)

            fireEvent(window, enterKeyPressEvent)
            expect(existingEnterKeyPressHandler).toHaveBeenCalledTimes(1)
            expect(sunbeamProviderEnterKeyPressHandler).not.toHaveBeenCalled()

            keyPressManager.removeAllKeyDownListeners()
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
            const keyPressManager1 = new KeyboardKeyPressManager()
            keyPressManager1.addKeyDownListener(existingAKeyPressHandler1)

            const { rerender } = render(
                <Root
                    as="section"
                    aria-details="focusable root"
                    focusManager={focusManager}
                    keyPressManager={keyPressManager1}
                    onKeyDown={sunbeamProviderAKeyPressHandler}
                >
                    hello
                </Root>
            )

            fireEvent(window, aKeyPressEvent)
            expect(sunbeamProviderAKeyPressHandler).toBeCalledTimes(1)
            expect(sunbeamProviderAKeyPressHandler).toBeCalledWith(expect.objectContaining({ key: "a" }))
            expect(existingAKeyPressHandler1).not.toBeCalled()
            sunbeamProviderAKeyPressHandler.mockClear()

            const keyPressManager2 = new KeyboardKeyPressManager()
            const existingAKeyPressHandler2 = jest.fn(aKeyHandler)
            keyPressManager2.addKeyDownListener(existingAKeyPressHandler2)

            rerender(
                <Root
                    focusManager={focusManager}
                    keyPressManager={keyPressManager2}
                    onKeyDown={sunbeamProviderAKeyPressHandler}
                >
                    hello
                </Root>
            )

            fireEvent(window, aKeyPressEvent)
            expect(sunbeamProviderAKeyPressHandler).toBeCalledTimes(1)
            expect(sunbeamProviderAKeyPressHandler).toBeCalledWith(expect.objectContaining({ key: "a" }))
            expect(existingAKeyPressHandler1).toBeCalledTimes(1)
            expect(existingAKeyPressHandler2).not.toBeCalled()
        })
    })

    describe("onKeyPress", () => {
        it("should call the listener", () => {
            const keyPressHandler = jest.fn()
            const keyPressEvent = new KeyboardEvent("keydown")

            const focusManager = new FocusManager()
            render(
                <Root focusManager={focusManager} onKeyDown={keyPressHandler}>
                    hello
                </Root>
            )

            fireEvent(window, keyPressEvent)
            expect(keyPressHandler).toBeCalledTimes(1)
            expect(keyPressHandler).toBeCalledWith(keyPressEvent)
        })

        it("should cleanup the listeners after unmount", () => {
            const keyPressHandler = jest.fn()
            const keyPressEvent = new KeyboardEvent("keydown")

            const focusManager = new FocusManager()
            const { rerender } = render(
                <Root focusManager={focusManager} onKeyDown={keyPressHandler}>
                    hello
                </Root>
            )

            fireEvent(window, keyPressEvent)
            expect(keyPressHandler).toBeCalledTimes(1)
            keyPressHandler.mockClear()

            // unmount
            rerender(<div />)

            fireEvent(window, keyPressEvent)
            expect(keyPressHandler).not.toBeCalled()
        })
    })
})
