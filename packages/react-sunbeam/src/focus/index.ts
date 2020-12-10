import getPreferredNode from "./getPreferredNode.js"
import type { FIXMEFocusableNode } from "./types.js"
import type { Direction } from "../spatialNavigation/index.js"

export type { FocusEvent, FIXMEFocusableNode } from "./types.js"
export { FocusManager } from "./FocusManager.js"
export { Focusable } from "./components/Focusable.js"
export { FocusContainer } from "./components/FocusContainer.js"
export { SunbeamProvider } from "./components/SunbeamProvider/index.js"
export { useSunbeam } from "./hooks/useSunbeam.js"
export { useFocusable } from "./hooks/useFocusable.js"

export function defaultGetPreferredChildOnFocus({
    focusableChildren,
    focusOrigin,
    direction,
}: {
    focusableChildren: Map<string, FIXMEFocusableNode>
    focusOrigin?: FIXMEFocusableNode
    direction?: Direction
}) {
    return getPreferredNode({ nodes: focusableChildren, focusOrigin, direction })
}
