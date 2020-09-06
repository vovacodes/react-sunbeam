import type { FocusableNodesMap, FocusableTreeNode } from "./types.js"
import { Direction, getBestCandidate, BoundingBox } from "../spatialNavigation/index.js"

export function getClosestFocusableNodeInDirection(
    focusableNodes: FocusableNodesMap,
    focusOrigin: BoundingBox,
    direction: Direction
): FocusableTreeNode | undefined {
    const focusableNodesArray = Array.from(focusableNodes.values())
    const nodeBoxes = focusableNodesArray.map((node) => node.getBoundingBox())

    const bestChildCandidateBox = getBestCandidate(focusOrigin, nodeBoxes, direction)
    if (!bestChildCandidateBox) return undefined

    return focusableNodesArray[nodeBoxes.indexOf(bestChildCandidateBox)]
}
