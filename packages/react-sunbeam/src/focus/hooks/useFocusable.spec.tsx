import React, { useRef } from "react"
import { cleanup, render, act } from "@testing-library/react"
import { FocusManager } from "../FocusManager"
import { SunbeamProvider } from "../components/SunbeamProvider"
import { useFocusable } from "./useFocusable"
import { Focusable } from ".."

describe("useFocusable", () => {
    // @ts-ignore
    const originalGetBoundingClientRect = global.Element.prototype.getBoundingClientRect
    beforeAll(() => {
        // JSDOM doesn't implement element.getBoundingClientRect()
        // so we provide a mock implementation that uses element style values
        // @ts-ignore
        global.Element.prototype.getBoundingClientRect = function() {
            return {
                bottom: Number.isNaN(parseInt(this.style.bottom)) ? 0 : parseInt(this.style.bottom),
                height: Number.isNaN(parseInt(this.style.height)) ? 0 : parseInt(this.style.height),
                left: Number.isNaN(parseInt(this.style.left)) ? 0 : parseInt(this.style.left),
                right: Number.isNaN(parseInt(this.style.right)) ? 0 : parseInt(this.style.right),
                top: Number.isNaN(parseInt(this.style.top)) ? 0 : parseInt(this.style.top),
                width: Number.isNaN(parseInt(this.style.width)) ? 0 : parseInt(this.style.width),
            }
        }
    })
    afterAll(() => {
        // @ts-ignore
        global.Element.prototype.getBoundingClientRect = originalGetBoundingClientRect
    })

    afterEach(cleanup)

    it("should make the component focusable", () => {
        function Component() {
            const ref = useRef<HTMLDivElement>(null)
            const { focused } = useFocusable({ elementRef: ref })
            return (
                <div ref={ref} style={{ width: "100px", height: "200px" }}>
                    {focused ? "I'm focused" : "I'm blurred"}
                </div>
            )
        }
        const focusManager = new FocusManager()

        const { getByText } = render(
            <SunbeamProvider focusManager={focusManager}>
                <Component />
            </SunbeamProvider>
        )

        expect(getByText("I'm focused")).toBeTruthy()
    })

    it(
        "should asynchronously (as microtask) call `onFocus` and `onBlur` " +
            "in the right order (childOnBlur -> parentOnBlur -> parentOnFocus -> childOnFocus) " +
            "when its focused status changes",
        async () => {
            const onFocusLeftParent = jest.fn()
            const onFocusLeftChild = jest.fn()
            const onFocusRightParent = jest.fn()
            const onFocusRightChild = jest.fn()
            const onBlurLeftParent = jest.fn()
            const onBlurLeftChild = jest.fn()
            const onBlurRightParent = jest.fn()
            const onBlurRightChild = jest.fn()
            function Child({
                focusKey,
                onFocus,
                onBlur,
            }: {
                focusKey: string
                onFocus: () => void
                onBlur: () => void
            }) {
                const ref = useRef<HTMLDivElement>(null)
                useFocusable({
                    focusKey,
                    elementRef: ref,
                    onFocus,
                    onBlur,
                })
                return <div ref={ref} />
            }
            const focusManager = new FocusManager({ initialFocusPath: ["left-parent", "left-child"] })

            render(
                <SunbeamProvider focusManager={focusManager}>
                    <Focusable onFocus={onFocusLeftParent} onBlur={onBlurLeftParent} focusKey="left-parent">
                        <Child onFocus={onFocusLeftChild} onBlur={onBlurLeftChild} focusKey="left-child" />
                    </Focusable>
                    <Focusable onFocus={onFocusRightParent} onBlur={onBlurRightParent} focusKey="right-parent">
                        <Child onFocus={onFocusRightChild} onBlur={onBlurRightChild} focusKey="right-child" />
                    </Focusable>
                </SunbeamProvider>
            )

            // no sync calls
            expect(onFocusLeftParent).not.toBeCalled()
            expect(onFocusLeftChild).not.toBeCalled()

            // wait for the end of the current task and scheduled microtasks
            await Promise.resolve()

            expect(onFocusLeftParent).toBeCalledTimes(1)
            expect(onFocusLeftChild).toBeCalledTimes(1)
            expect(onFocusLeftParent.mock.invocationCallOrder[0]).toBeLessThan(
                onFocusLeftChild.mock.invocationCallOrder[0]
            )
            expect(onBlurLeftParent).not.toBeCalled()
            expect(onBlurLeftChild).not.toBeCalled()
            expect(onFocusRightParent).not.toBeCalled()
            expect(onFocusRightChild).not.toBeCalled()
            expect(onBlurRightParent).not.toBeCalled()
            expect(onBlurRightChild).not.toBeCalled()
            onFocusLeftParent.mockClear()
            onFocusLeftChild.mockClear()
            onFocusRightParent.mockClear()
            onFocusRightChild.mockClear()
            onBlurLeftParent.mockClear()
            onBlurLeftChild.mockClear()
            onBlurRightParent.mockClear()
            onBlurRightChild.mockClear()

            act(() => {
                focusManager.setFocus(["right-parent", "right-child"])
            })

            // no sync call
            expect(onBlurLeftParent).not.toBeCalled()
            expect(onBlurLeftChild).not.toBeCalled()
            expect(onFocusRightParent).not.toBeCalled()
            expect(onFocusRightChild).not.toBeCalled()

            // wait for the end of the current task and scheduled microtasks
            await Promise.resolve()

            expect(onFocusLeftParent).not.toBeCalled()
            expect(onFocusLeftChild).not.toBeCalled()
            expect(onBlurLeftParent).toBeCalledTimes(1)
            expect(onBlurLeftChild).toBeCalledTimes(1)
            expect(onBlurLeftChild.mock.invocationCallOrder[0]).toBeLessThan(
                onBlurLeftParent.mock.invocationCallOrder[0]
            )
            expect(onFocusRightParent).toBeCalledTimes(1)
            expect(onFocusRightChild).toBeCalledTimes(1)
            expect(onFocusRightParent.mock.invocationCallOrder[0]).toBeLessThan(
                onFocusRightChild.mock.invocationCallOrder[0]
            )
            expect(onBlurRightParent).not.toBeCalled()
            expect(onBlurRightChild).not.toBeCalled()
        }
    )
})
