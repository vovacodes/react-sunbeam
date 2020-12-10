import type { FocusKey, FIXMEFocusableNode } from "./types.js"
import type { Direction } from "../spatialNavigation/index.js"
import { getClosestFocusableNodeInDirection } from "./getClosestFocusableNodeInDirection.js"

interface Arguments {
    nodes: Map<FocusKey, FIXMEFocusableNode>
    focusOrigin?: FIXMEFocusableNode
    direction?: Direction
}

export default function getPreferredNode({ nodes, focusOrigin, direction }: Arguments): FIXMEFocusableNode | undefined {
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
