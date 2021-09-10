import type { FocusKey, IFocusableNode } from "./types.js"
import type { Direction } from "../spatialNavigation/index.js"
import { getClosestFocusableNodeInDirection } from "./getClosestFocusableNodeInDirection.js"

interface Arguments {
    nodes: Map<FocusKey, IFocusableNode>
    focusOrigin?: IFocusableNode
    direction?: Direction
}

export default function getPreferredNode({ nodes, focusOrigin, direction }: Arguments): IFocusableNode | undefined {
    if (!focusOrigin || !direction) {
        // pick the child that was mounted first
        return nodes.values().next().value
    }

    const preferredFocusableNode = getClosestFocusableNodeInDirection(nodes, focusOrigin.getBoundingBox(), direction)
    if (!preferredFocusableNode) {
        // pick the child that was mounted first
        return nodes.values().next().value
    }

    return preferredFocusableNode
}
