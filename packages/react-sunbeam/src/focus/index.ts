import getPreferredNode from "./getPreferredNode"
import { FocusableTreeNode } from "./types"
import { Direction } from "../spatialNavigation"

export { FocusEvent } from "./types"
export { FocusManager } from "./FocusManager"
export { Focusable } from "./components/Focusable"
export { SunbeamProvider } from "./components/SunbeamProvider"
export { useSunbeam } from "./hooks/useSunbeam"
export { useFocusable } from "./hooks/useFocusable"

export type FocusableTreeNode = FocusableTreeNode

// eslint-disable-next-line @typescript-eslint/camelcase
export function unstable_defaultGetPreferredChildOnFocusReceive({
    focusableChildren,
    focusOrigin,
    direction,
}: {
    focusableChildren: Map<string, FocusableTreeNode>
    focusOrigin?: FocusableTreeNode
    direction?: Direction
}) {
    return getPreferredNode({ nodes: focusableChildren, focusOrigin, direction })
}
