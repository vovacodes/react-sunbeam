import getPreferredNode from "./getPreferredNode"
import { FocusableNodesMap, FocusableTreeNode } from "./types"
import { Direction } from "../spatialNavigation"

export { FocusManager } from "./FocusManager"
export { Focusable } from "./components/Focusable"
export { SunbeamProvider } from "./components/SunbeamProvider"
export { useSunbeam } from "./hooks/useSunbeam"
export { useFocusable } from "./hooks/useFocusable"

// eslint-disable-next-line @typescript-eslint/camelcase
export function unstable_defaultGetPreferredChildOnFocusReceive({
    focusableChildren,
    focusOrigin,
    direction,
}: {
    focusableChildren: FocusableNodesMap
    focusOrigin?: FocusableTreeNode
    direction?: Direction
}) {
    return getPreferredNode({ nodes: focusableChildren, focusOrigin, direction })
}
