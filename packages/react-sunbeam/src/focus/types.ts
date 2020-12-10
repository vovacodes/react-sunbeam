import type { BoundingBox, Direction } from "../spatialNavigation/index.js"

export type FocusKey = string

export type FocusEvent = {
    getBoundingClientRect: () => ClientRect
    focusablePath: readonly string[]
}

export type FocusPath = readonly string[]

export type FocusUpdatesSubscriber = (event: { focusPath: FocusPath }) => void

export type UnsubscribeFromFocusUpdatesFn = () => void

export type CustomGetPreferredChildFn = (params: {
    focusableChildren: Map<FocusKey, FIXMEFocusableNode>
    focusOrigin?: FIXMEFocusableNode
    direction?: Direction
}) => FIXMEFocusableNode | undefined

export type GetPreferredChildFn = (
    focusOrigin?: FIXMEFocusableNode,
    direction?: Direction
) => FIXMEFocusableNode | undefined

/**
 * The public API version of FocusableNode class's interface.
 */
export interface FIXMEFocusableNode {
    getFocusKey(): FocusKey
    getPath(): FocusKey[]
    getBoundingBox(): BoundingBox
    getParent(): FIXMEFocusableNode | undefined
    getChildren(): Map<FocusKey, FIXMEFocusableNode>
    getPreferredChild: GetPreferredChildFn
    getLock(): Direction[] | Direction | undefined
}
