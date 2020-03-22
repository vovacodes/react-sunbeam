import { act } from "@testing-library/react"

export function mockGetBoundingClientRect() {
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
}

export function waitForFocusTreeUpdates(): Promise<void> {
    return act(() => Promise.resolve())
}
