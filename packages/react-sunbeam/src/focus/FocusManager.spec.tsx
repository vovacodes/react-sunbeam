import * as React from "react"
import { act, render } from "@testing-library/react"
import { Root } from "./components/Root/index.js"
import { Focusable } from "./components/Focusable.js"
import { FocusManager } from "./FocusManager.js"

describe("FocusManager", () => {
    describe("setFocus", () => {
        it("should validate and fix the provided focusPath", () => {
            const focusManager = new FocusManager({ initialFocusPath: ["left-parent", "left-child"] })

            render(
                <Root focusManager={focusManager}>
                    <Focusable focusKey="left-parent">
                        <Focusable focusKey="left-child">Left child</Focusable>
                    </Focusable>
                    <Focusable focusKey="right-parent">
                        <Focusable focusKey="right-child">Right child</Focusable>
                    </Focusable>
                </Root>
            )

            expect(focusManager.getFocusPath()).toEqual(["left-parent", "left-child"])

            act(() => {
                focusManager.setFocus(["right-parent"])
            })

            expect(focusManager.getFocusPath()).toEqual(["right-parent", "right-child"])
        })
    })
})
