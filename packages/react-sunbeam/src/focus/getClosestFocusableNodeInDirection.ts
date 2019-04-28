import { FocusableNodesMap, FocusableTreeNode } from "./types"
import { Direction, getBestCandidate, BoundingBox } from "../spatialNavigation"

export function getClosestFocusableNodeInDirection(
    focusableNodes: FocusableNodesMap,
    focusOrigin: BoundingBox,
    direction: Direction
): FocusableTreeNode | undefined {
    const focusableNodesArray = Array.from(focusableNodes.values())
    const nodeBoxes = focusableNodesArray.map(node => node.getBoundingBox())

    const bestChildCandidateBox = getBestCandidate(focusOrigin, nodeBoxes, direction)
    if (!bestChildCandidateBox) return undefined

    return focusableNodesArray[nodeBoxes.indexOf(bestChildCandidateBox)]
}
