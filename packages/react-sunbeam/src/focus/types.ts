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
    focusableChildren: Map<FocusKey, IFocusableNode>
    focusOrigin?: IFocusableNode
    direction?: Direction
}) => IFocusableNode | undefined

export type GetPreferredChildFn = (focusOrigin?: IFocusableNode, direction?: Direction) => IFocusableNode | undefined

/**
 * The public API version of FocusableNode class's interface.
 */
export interface IFocusableNode {
    getFocusKey(): FocusKey
    getPath(): FocusKey[]
    getBoundingBox(): BoundingBox
    getParent(): IFocusableNode | undefined
    getChildren(): Map<FocusKey, IFocusableNode>
    getPreferredChild: GetPreferredChildFn
    getLock(): Direction[] | Direction | undefined
}
