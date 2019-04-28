import { ChildrenMap, FocusableTreeNode } from "./types"
import { Direction, getBestCandidate, BoundingBox } from "../spatialNavigation"

export function getClosestFocusableChildInDirection(
    childrenMap: ChildrenMap,
    focusOrigin: BoundingBox,
    direction: Direction
): FocusableTreeNode | undefined {
    const childNodesArray = Array.from(childrenMap.values())
    const childBoxes = childNodesArray.map(node => node.getBoundingBox())

    const bestChildCandidateBox = getBestCandidate(focusOrigin, childBoxes, direction)
    if (!bestChildCandidateBox) return undefined

    return childNodesArray[childBoxes.indexOf(bestChildCandidateBox)]
}
