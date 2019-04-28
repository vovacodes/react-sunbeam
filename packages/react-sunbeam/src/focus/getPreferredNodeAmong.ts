import { ChildrenMap } from "./types"
import { Direction, BoundingBox } from "../spatialNavigation"
import { getClosestFocusableChildInDirection } from "./getClosestFocusableChildInDirection"

export default function getPreferredNodeAmong(nodes: ChildrenMap) {
    return (focusOrigin?: BoundingBox, direction?: Direction) => {
        if (!focusOrigin || !direction) {
            // pick the child that was mounted first
            return nodes.values().next().value
        }

        const preferredChild = getClosestFocusableChildInDirection(nodes, focusOrigin, direction)

        return preferredChild ? preferredChild : nodes.values().next().value
    }
}
