import React from "react"
import { act, render } from "@testing-library/react"
import { FocusManager, Root } from "../index.js"
import { Focusable } from "./Focusable.js"
import { mockGetBoundingClientRect, waitForFocusTreeUpdates } from "../../test/utils.js"
import { Direction } from "../../spatialNavigation/index.js"

describe("Focusable", () => {
    mockGetBoundingClientRect()

    it.todo("should render in isolation (without Provider) with no errors")

    it("should pass `focused` and `path` to its render callback when one is provided", () => {
        const fn = jest.fn()
        const focusKey = "my-focusable"
        const focusManager = new FocusManager({ initialFocusPath: [focusKey] })

        render(
            <Root focusManager={focusManager}>
                <Focusable focusKey={focusKey}>
                    {({ focused, path }) => {
                        fn({ focused, path })
                        return <div />
                    }}
                </Focusable>
            </Root>
        )

        expect(fn).toBeCalledTimes(1)
        expect(fn).toBeCalledWith({ focused: true, path: [focusKey] })
    })

    it("should render children passed to it", () => {
        const focusManager = new FocusManager()
        const { getByText } = render(
            <Root focusManager={focusManager}>
                <Focusable>
                    <div>I am a child</div>
                </Focusable>
            </Root>
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
                <Root focusManager={focusManager}>
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
                </Root>
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

    it('should not participate in focus management if "focusable" is set to false', async () => {
        const focusManager = new FocusManager({ initialFocusPath: ["left"] })

        const { rerender } = render(
            <Root focusManager={focusManager}>
                <Focusable focusKey="left" style={{ width: "100px", height: "200px", top: 0, left: 0 }}>
                    Left
                </Focusable>
                <Focusable focusKey="rightParent" style={{ width: "100px", height: "200px", top: 0, left: 200 }}>
                    <Focusable focusKey="rightChild" style={{ width: "100px", height: "200px", top: 0, left: 200 }}>
                        Right
                    </Focusable>
                </Focusable>
            </Root>
        )

        act(() => focusManager.moveRight())

        expect(focusManager.getFocusPath()).toEqual(["rightParent", "rightChild"])

        // make "rightChild" not "focusable"
        rerender(
            <Root focusManager={focusManager}>
                <Focusable focusKey="left" style={{ width: "100px", height: "200px", top: 0, left: 0 }}>
                    Left
                </Focusable>
                <Focusable focusKey="rightParent" style={{ width: "100px", height: "200px", top: 0, left: 200 }}>
                    <Focusable
                        focusable={false}
                        focusKey="rightChild"
                        style={{ width: "100px", height: "200px", top: 0, left: 200 }}
                    >
                        Right
                    </Focusable>
                </Focusable>
            </Root>
        )
        await waitForFocusTreeUpdates()

        expect(focusManager.getFocusPath()).toEqual(["rightParent"])

        // make "rightParent" not "focusable"
        rerender(
            <Root focusManager={focusManager}>
                <Focusable focusKey="left" style={{ width: "100px", height: "200px", top: 0, left: 0 }}>
                    Left
                </Focusable>
                <Focusable
                    focusable={false}
                    focusKey="rightParent"
                    style={{ width: "100px", height: "200px", top: 0, left: 200 }}
                >
                    <Focusable focusKey="rightChild" style={{ width: "100px", height: "200px", top: 0, left: 200 }}>
                        Right
                    </Focusable>
                </Focusable>
            </Root>
        )
        await waitForFocusTreeUpdates()

        expect(focusManager.getFocusPath()).toEqual(["left"])

        act(() => focusManager.moveRight())

        expect(focusManager.getFocusPath()).toEqual(["left"])
    })

    it('should prevent focus from leaving in the directions specified in the "lock" props', () => {
        const focusManager = new FocusManager({ initialFocusPath: ["top-left"] })

        render(
            <Root focusManager={focusManager}>
                <Focusable
                    lock={Direction.RIGHT}
                    focusKey="top-left"
                    style={{ width: 100, height: 200, top: 0, left: 0 }}
                >
                    Top Left
                </Focusable>
                <Focusable focusKey="top-right" style={{ width: 100, height: 200, top: 0, left: 200 }}>
                    Top Right
                </Focusable>
                <Focusable
                    lock={[Direction.RIGHT, Direction.UP]}
                    focusKey="bottom-left"
                    style={{ width: 100, height: 200, top: 300, left: 0 }}
                >
                    Bottom Left
                </Focusable>
                <Focusable focusKey="bottom-right" style={{ width: 100, height: 200, top: 300, left: 200 }}>
                    Bottom Right
                </Focusable>
            </Root>
        )

        act(() => focusManager.moveRight())
        // should not change
        expect(focusManager.getFocusPath()).toEqual(["top-left"])

        act(() => focusManager.moveDown())
        expect(focusManager.getFocusPath()).toEqual(["bottom-left"])

        act(() => focusManager.moveUp())
        // should not change
        expect(focusManager.getFocusPath()).toEqual(["bottom-left"])

        act(() => focusManager.moveRight())
        // should not change
        expect(focusManager.getFocusPath()).toEqual(["bottom-left"])
    })

    it('should prevent focus from leaving in the directions specified in the "lock" props when it has children', async () => {
        const focusManager = new FocusManager({ initialFocusPath: ["leftParent", "topChild"] })

        const { rerender } = render(
            <Root focusManager={focusManager}>
                <Focusable
                    lock={Direction.RIGHT}
                    focusKey="leftParent"
                    style={{ width: 100, height: 300, top: 0, left: 0 }}
                >
                    <Focusable focusKey="topChild" style={{ width: 100, height: 100, top: 0, left: 0 }}>
                        Left Top
                    </Focusable>
                    <Focusable focusKey="bottomChild" style={{ width: 100, height: 100, top: 200, left: 0 }}>
                        Left Bottom
                    </Focusable>
                </Focusable>
                <Focusable focusKey="right" style={{ width: 100, height: 200, top: 0, left: 200 }}>
                    Right
                </Focusable>
            </Root>
        )

        act(() => focusManager.moveRight())
        expect(focusManager.getFocusPath()).toEqual(["leftParent", "topChild"])

        act(() => focusManager.moveDown())
        expect(focusManager.getFocusPath()).toEqual(["leftParent", "bottomChild"])

        act(() => focusManager.moveRight())
        // should not change
        expect(focusManager.getFocusPath()).toEqual(["leftParent", "bottomChild"])

        // release the focus lock
        rerender(
            <Root focusManager={focusManager}>
                <Focusable focusKey="leftParent" style={{ width: 100, height: 300, top: 0, left: 0 }}>
                    <Focusable focusKey="topChild" style={{ width: 100, height: 100, top: 0, left: 0 }}>
                        Left Top
                    </Focusable>
                    <Focusable focusKey="bottomChild" style={{ width: 100, height: 100, top: 200, left: 0 }}>
                        Left Bottom
                    </Focusable>
                </Focusable>
                <Focusable focusKey="right" style={{ width: 100, height: 200, top: 0, left: 200 }}>
                    Right
                </Focusable>
            </Root>
        )
        await waitForFocusTreeUpdates()

        act(() => focusManager.moveRight())
        expect(focusManager.getFocusPath()).toEqual(["right"])
    })

    describe("getPreferredChildOnFocus", () => {
        it("selects which child to focus on when Root becomes focused", () => {
            const focusManager = new FocusManager()

            render(
                <Root focusManager={focusManager}>
                    <Focusable
                        getPreferredChildOnFocus={({ focusableChildren }) => {
                            return focusableChildren.get("middleChild")
                        }}
                        focusKey="leftParent"
                    >
                        <Focusable focusKey="topChild">Left Top</Focusable>
                        <Focusable focusKey="middleChild">Left Middle</Focusable>
                        <Focusable focusKey="bottomChild">Left Bottom</Focusable>
                    </Focusable>
                    <Focusable focusKey="right">Right</Focusable>
                </Root>
            )

            expect(focusManager.getFocusPath()).toEqual(["leftParent", "middleChild"])
        })
    })
})
