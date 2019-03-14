import { ChildrenMap } from "./types"
import { BoundingBox, Direction, getBestCandidate } from "../spatialNavigation"

export default function getPreferredNodeAmong(nodes: ChildrenMap) {
    return (focusOrigin?: BoundingBox, direction?: Direction) => {
        if (!focusOrigin || !direction) {
            // pick the child that was mounted first
            return nodes.values().next().value
        }

        const childNodesArray = Array.from(nodes.values())
        const childBoxes = childNodesArray.map(node => node.getBoundingBox())

        const bestChildCandidateBox = getBestCandidate(focusOrigin, childBoxes, direction)

        if (!bestChildCandidateBox) {
            // pick the child that was mounted first
            return nodes.values().next().value
        }

        const bestChildCandidateBoxIndex = childBoxes.indexOf(bestChildCandidateBox)

        return childNodesArray[bestChildCandidateBoxIndex]
    }
}
