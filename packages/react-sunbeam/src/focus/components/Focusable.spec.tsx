import React from "react"
import { cleanup, render, act } from "@testing-library/react"
import { FocusManager, SunbeamProvider } from ".."
import { Focusable } from "./Focusable"

describe("Focusable", () => {
    afterEach(cleanup)

    it("should pass `focused` and `path` to its render callback when one is provided", () => {
        const fn = jest.fn()
        const focusKey = "my-focusable"
        const focusManager = new FocusManager({ initialFocusPath: [focusKey] })

        render(
            <SunbeamProvider focusManager={focusManager}>
                <Focusable focusKey={focusKey}>
                    {({ focused, path }) => {
                        fn({ focused, path })
                        return <div />
                    }}
                </Focusable>
            </SunbeamProvider>
        )

        expect(fn).toBeCalledTimes(1)
        expect(fn).toBeCalledWith({ focused: true, path: [focusKey] })
    })

    it("should render children passed to it", () => {
        const focusManager = new FocusManager()
        const { getByText } = render(
            <SunbeamProvider focusManager={focusManager}>
                <Focusable>
                    <div>I am a child</div>
                </Focusable>
            </SunbeamProvider>
        )
        expect(getByText("I am a child")).toBeTruthy()
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
            const focusManager = new FocusManager({ initialFocusPath: ["left-parent", "left-child"] })
            render(
                <SunbeamProvider focusManager={focusManager}>
                    <Focusable onFocus={onFocusLeftParent} onBlur={onBlurLeftParent} focusKey="left-parent">
                        <Focusable onFocus={onFocusLeftChild} onBlur={onBlurLeftChild} focusKey="left-child">
                            Left
                        </Focusable>
                    </Focusable>
                    <Focusable onFocus={onFocusRightParent} onBlur={onBlurRightParent} focusKey="right-parent">
                        <Focusable onFocus={onFocusRightChild} onBlur={onBlurRightChild} focusKey="right-child">
                            Right
                        </Focusable>
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
