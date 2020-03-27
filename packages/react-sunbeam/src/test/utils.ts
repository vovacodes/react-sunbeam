import { act } from "@testing-library/react"

export function waitForFocusTreeUpdates(): Promise<void> {
    return act(() => Promise.resolve())
}

export function mockGetBoundingClientRect() {
    const originalGetBoundingClientRect = window.Element.prototype.getBoundingClientRect
    beforeAll(() => {
        // JSDOM doesn't implement element.getBoundingClientRect()
        // so we provide a mock implementation that uses element style values
        window.Element.prototype.getBoundingClientRect = function () {
            const { style } = this as HTMLElement

            const left = style.left != null ? parseInt(style.left) : 0
            const top = style.top != null ? parseInt(style.top) : 0
            const width =
                style.width != null
                    ? parseInt(style.width)
                    : style.right != null
                    ? parseInt(style.right) - parseInt(style.left)
                    : 0
            const height =
                style.height != null
                    ? parseInt(style.height)
                    : style.bottom != null
                    ? parseInt(style.bottom) - parseInt(style.top)
                    : 0

            const rect = createRect(left, top, width, height)
            return {
                ...rect,
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

function createRect(x: number, y: number, width: number, height: number): DOMRect {
    let left: number | undefined
    let right: number | undefined
    let top: number | undefined
    let bottom: number | undefined

    const rect = {}
    Object.defineProperties(rect, {
        x: {
            get: function () {
                return x
            },
            set: function (newX) {
                x = newX
                left = right = undefined
            },
            enumerable: true,
        },
        y: {
            get: function () {
                return y
            },
            set: function (newY) {
                y = newY
                top = bottom = undefined
            },
            enumerable: true,
        },
        width: {
            get: function () {
                return width
            },
            set: function (newWidth) {
                width = newWidth
                left = right = undefined
            },
            enumerable: true,
        },
        height: {
            get: function () {
                return height
            },
            set: function (newHeight) {
                height = newHeight
                top = bottom = undefined
            },
            enumerable: true,
        },
        left: {
            get: function () {
                if (left === undefined) {
                    left = x + Math.min(0, width)
                }
                return left
            },
            enumerable: true,
        },
        right: {
            get: function () {
                if (right === undefined) {
                    right = x + Math.max(0, width)
                }
                return right
            },
            enumerable: true,
        },
        top: {
            get: function () {
                if (top === undefined) {
                    top = y + Math.min(0, height)
                }
                return top
            },
            enumerable: true,
        },
        bottom: {
            get: function () {
                if (bottom === undefined) {
                    bottom = y + Math.max(0, height)
                }
                return bottom
            },
            enumerable: true,
        },
    })

    return rect as DOMRect
}
