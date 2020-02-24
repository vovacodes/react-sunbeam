import { FocusableTreeNode } from "../types"
import { Direction, getBestCandidate } from "../../spatialNavigation"
import { boxesWithinFrustumOfOrigin } from "../../spatialNavigation/frustumFilteringUtils"
import { getSiblings } from "../FocusableTreeUtils"

export default function findBestDefaultStrategy(
    focusOrigin?: FocusableTreeNode,
    direction?: Direction
): FocusableTreeNode | undefined {
    if (!focusOrigin || !direction) {
        return
    }
    return findBestCandidateAmongSiblingsOf(focusOrigin, focusOrigin, direction)
}

export function findBestCandidateAmongSiblingsOf(
    treeNode: FocusableTreeNode,
    focusOrigin: FocusableTreeNode,
    direction: Direction
): FocusableTreeNode | undefined {
    // 2. Search for the best candidate among siblings of the current focusOrigin
    // If not found repeat the same process for the parent FocusableNode's siblings
    // until either the candidate is found or the FocusableRootNode is reached
    const focusableSiblings = getSiblings(treeNode)

    const siblingBoxes = focusableSiblings.map(node => node.getBoundingBox())
    const siblingsWithinFrustum = boxesWithinFrustumOfOrigin(siblingBoxes, treeNode.getBoundingBox(), direction)
    const bestCandidateBox = getBestCandidate(focusOrigin.getBoundingBox(), siblingsWithinFrustum, direction)
    if (!bestCandidateBox) {
        const parent = treeNode.getParent()
        // Best candidate is not found, so the focus doesn't move
        if (!parent) return

        return findBestCandidateAmongSiblingsOf(parent, focusOrigin, direction)
    }

    const bestCandidateIndex = siblingBoxes.indexOf(bestCandidateBox)
    let bestCandidateNode = focusableSiblings[bestCandidateIndex]

    // 3. Once the best candidate is found recursively ask it
    // for the preferredChild FocusableNode until a leaf node is reached
    while (bestCandidateNode) {
        if (bestCandidateNode.getChildren().size === 0) {
            // we found the bestCandidate
            break
        }

        const preferredChild = bestCandidateNode.getPreferredChild(focusOrigin, direction)
        if (!preferredChild) {
            throw new Error(
                "`focusableTreeNode.getPreferredChild()` should " +
                    "never return `undefined` when it has at least 1 child"
            )
        }

        bestCandidateNode = preferredChild
    }

    return bestCandidateNode
}
