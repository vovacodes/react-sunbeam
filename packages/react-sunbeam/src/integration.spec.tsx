import React, { useRef } from "react"
import { act, render, fireEvent } from "@testing-library/react"
import { Root, FocusManager, Focusable, useFocusable } from "./focus/index.js"
import type { KeyPressListener } from "./keyPressManagement/index.js"

describe("Sunbeam integration", () => {
    test.todo("should re-render only the affected nodes on focus change")
})

describe("Key press management integration", () => {
    test("Nested key handlers", () => {
        const sunbeamProviderKeyHandler = jest.fn((event) => event.stopPropagation())
        const focusable1KeyHandler = jest.fn((event) => event.stopPropagation())
        const focusable2KeyHandler = jest.fn()
        const focusableButton1KeyHandler = jest.fn()
        const focusableButton2KeyHandler = jest.fn((event) => event.stopPropagation())

        function FocusableButton({ focusKey, onKeyPress }: { focusKey: string; onKeyPress: KeyPressListener }) {
            const ref = useRef(null)
            const { focused } = useFocusable({ focusKey, elementRef: ref, onKeyDown: onKeyPress })
            return <button ref={ref}>I am a{focused ? " focused " : " "}button</button>
        }

        const focusManager = new FocusManager({ initialFocusPath: ["Focusable-1"] })
        render(
            <Root focusManager={focusManager} onKeyDown={sunbeamProviderKeyHandler}>
                <Focusable focusKey={"Focusable-1"} onKeyDown={focusable1KeyHandler}>
                    hello
                </Focusable>
                <Focusable focusKey={"Focusable-2"} onKeyDown={focusable2KeyHandler}>
                    <FocusableButton focusKey="FocusableButton-1" onKeyPress={focusableButton1KeyHandler} />
                    <FocusableButton focusKey="FocusableButton-2" onKeyPress={focusableButton2KeyHandler} />
                </Focusable>
            </Root>
        )

        fireEvent(window, new KeyboardEvent("keydown"))
        expect(sunbeamProviderKeyHandler).not.toHaveBeenCalled()
        expect(focusable1KeyHandler).toHaveBeenCalledTimes(1)
        expect(focusable2KeyHandler).not.toHaveBeenCalled()
        expect(focusableButton1KeyHandler).not.toHaveBeenCalled()
        expect(focusableButton2KeyHandler).not.toHaveBeenCalled()
        focusable1KeyHandler.mockClear()

        act(() => focusManager.setFocus(["Focusable-2", "FocusableButton-1"]))
        fireEvent(window, new KeyboardEvent("keydown"))

        expect(sunbeamProviderKeyHandler).toHaveBeenCalledTimes(1)
        expect(focusable1KeyHandler).not.toHaveBeenCalled()
        expect(focusable2KeyHandler).toHaveBeenCalledTimes(1)
        expect(focusableButton1KeyHandler).toHaveBeenCalledTimes(1)
        expect(focusableButton2KeyHandler).not.toHaveBeenCalled()
        sunbeamProviderKeyHandler.mockClear()
        focusable2KeyHandler.mockClear()
        focusableButton1KeyHandler.mockClear()

        act(() => focusManager.setFocus(["Focusable-2", "FocusableButton-2"]))
        fireEvent(window, new KeyboardEvent("keydown"))

        expect(sunbeamProviderKeyHandler).not.toHaveBeenCalled()
        expect(focusable1KeyHandler).not.toHaveBeenCalled()
        expect(focusable2KeyHandler).not.toHaveBeenCalled()
        expect(focusableButton1KeyHandler).not.toHaveBeenCalled()
        expect(focusableButton2KeyHandler).toHaveBeenCalledTimes(1)
    })
})
