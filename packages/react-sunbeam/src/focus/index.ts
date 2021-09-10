import getPreferredNode from "./getPreferredNode.js"
import type { IFocusableNode } from "./types.js"
import type { Direction } from "../spatialNavigation/index.js"

export type { FocusEvent, IFocusableNode } from "./types.js"
export { FocusManager } from "./FocusManager.js"
export { Branch } from "./components/Branch.js"
export { Root } from "./components/Root/index.js"
export { Focusable } from "./components/Focusable.js"
export { useFocusManager } from "./hooks/useFocusManager.js"
export { useFocusable } from "./hooks/useFocusable.js"

export function defaultGetPreferredChildOnFocus({
    focusableChildren,
    focusOrigin,
    direction,
}: {
    focusableChildren: Map<string, IFocusableNode>
    focusOrigin?: IFocusableNode
    direction?: Direction
}) {
    return getPreferredNode({ nodes: focusableChildren, focusOrigin, direction })
}
