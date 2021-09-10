import type { IFocusableNode } from "./types.js"
import type { FocusKey } from "./types.js"
import type { Direction, BoundingBox } from "../spatialNavigation/index.js"
import { getBestCandidate } from "../spatialNavigation/index.js"

export function getClosestFocusableNodeInDirection<N extends IFocusableNode>(
    focusableNodes: Map<FocusKey, N>,
    focusOrigin: BoundingBox,
    direction: Direction
): N | undefined {
    const focusableNodesArray = Array.from(focusableNodes.values())
    const nodeBoxes = focusableNodesArray.map((node) => node.getBoundingBox())

    const bestChildCandidateBox = getBestCandidate(focusOrigin, nodeBoxes, direction)
    if (!bestChildCandidateBox) return undefined

    return focusableNodesArray[nodeBoxes.indexOf(bestChildCandidateBox)]
}
