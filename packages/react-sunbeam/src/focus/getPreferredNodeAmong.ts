import { FocusableNodesMap } from "./types"
import { Direction, BoundingBox } from "../spatialNavigation"
import { getClosestFocusableNodeInDirection } from "./getClosestFocusableNodeInDirection"

export default function getPreferredNodeAmong(nodes: FocusableNodesMap) {
    return (focusOrigin?: BoundingBox, direction?: Direction) => {
        if (!focusOrigin || !direction) {
            // pick the child that was mounted first
            return nodes.values().next().value
        }

        const preferredFocusableNode = getClosestFocusableNodeInDirection(nodes, focusOrigin, direction)
        if (!preferredFocusableNode) {
            // pick the child that was mounted first
            return nodes.values().next().value
        }

        return preferredFocusableNode
    }
}
