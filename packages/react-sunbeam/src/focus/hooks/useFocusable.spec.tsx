import React, { useRef } from "react"
import { cleanup, render, act } from "@testing-library/react"
import { FocusManager } from "../FocusManager"
import { SunbeamProvider } from "../components/SunbeamProvider"
import { useFocusable } from "./useFocusable"
import { Focusable } from ".."

describe("useFocusable", () => {
    const originalGetBoundingClientRect = window.Element.prototype.getBoundingClientRect
    beforeAll(() => {
        // JSDOM doesn't implement element.getBoundingClientRect()
        // so we provide a mock implementation that uses element style values
        window.Element.prototype.getBoundingClientRect = function() {
            const { style } = this as HTMLElement
            return {
                bottom: style.bottom == null ? 0 : parseInt(style.bottom),
                height: style.height == null ? 0 : parseInt(style.height),
                left: style.left == null ? 0 : parseInt(style.left),
                x: style.left == null ? 0 : parseInt(style.left),
                right: style.right == null ? 0 : parseInt(style.right),
                top: style.top == null ? 0 : parseInt(style.top),
                y: style.top == null ? 0 : parseInt(style.top),
                width: style.width == null ? 0 : parseInt(style.width),
                toJSON() {
                    throw new Error("toJSON not supported")
                },
            }
        }
    })
    afterAll(() => {
        window.Element.prototype.getBoundingClientRect = originalGetBoundingClientRect
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
