import type { FocusPath, FocusUpdatesSubscriber, IFocusableNode, UnsubscribeFromFocusUpdatesFn } from "./types.js"
import { getNodeByPath, getPathToNode, getSiblings, validateAndFixFocusPathIfNeeded } from "./FocusableTreeUtils.js"
import { Direction, getBestCandidate } from "../spatialNavigation/index.js"
import { boxesWithinFrustumOfOrigin } from "../spatialNavigation/frustumFilteringUtils.js"
import { unstable_batchedUpdates } from "react-dom"

interface Options {
    initialFocusPath: FocusPath
}

const defaultOptions = {
    initialFocusPath: [],
}

export class FocusManager {
    /**
     * path from the focusableRoot to the focusTarget.
     */
    private focusPath: readonly string[]
    private focusableRoot: IFocusableNode | undefined
    private subscribers: Set<FocusUpdatesSubscriber>

    public constructor(options: Options = defaultOptions) {
        this.focusPath = options.initialFocusPath

        this.subscribers = new Set()
    }

    // ===================================
    // Public interface
    // ===================================

    public moveLeft(): void {
        this.moveFocusInDirection(Direction.LEFT)
    }

    public moveRight(): void {
        this.moveFocusInDirection(Direction.RIGHT)
    }

    public moveUp(): void {
        this.moveFocusInDirection(Direction.UP)
    }

    public moveDown(): void {
        this.moveFocusInDirection(Direction.DOWN)
    }

    public subscribe(subscriber: FocusUpdatesSubscriber): UnsubscribeFromFocusUpdatesFn {
        this.subscribers.add(subscriber)

        return () => {
            this.subscribers.delete(subscriber)
        }
    }

    public setFocus(focusPath: FocusPath): void {
        if (!this.focusableRoot) return

        const fixedFocusPath = validateAndFixFocusPathIfNeeded(focusPath, this.focusableRoot)
        this.focusPath = fixedFocusPath ?? focusPath

        this.notifySubscribers()
    }

    public getFocusPath(): FocusPath {
        return this.focusPath
    }

    // ===================================
    // Internal interface
    // ===================================

    /** @private */
    public setFocusableRoot(focusableRoot: IFocusableNode): void {
        this.focusableRoot = focusableRoot

        this.revalidateFocusPath()
    }

    /** @private */
    public clearFocusableRoot(): void {
        this.focusableRoot = undefined
    }

    /** @private */
    public revalidateFocusPath(): void {
        if (!this.focusableRoot) {
            this.setFocus([])
            return
        }

        const fixedFocusPath = validateAndFixFocusPathIfNeeded(this.focusPath, this.focusableRoot)
        if (fixedFocusPath) {
            this.setFocus(fixedFocusPath)
        }
    }

    // ===================================
    // Private methods
    // ===================================

    private notifySubscribers(): void {
        const { focusPath } = this
        // We need to batch the React state updates caused by the subscribers' calls,
        // to prevent double/triple re-rendering.
        unstable_batchedUpdates(() => {
            this.subscribers.forEach((subscriber) => {
                subscriber({ focusPath })
            })
        })
    }

    private moveFocusInDirection(direction: Direction): void {
        if (!this.focusableRoot) return

        // 1. get current focus origin
        const focusOrigin = getNodeByPath(this.focusPath, this.focusableRoot)
        if (!focusOrigin) {
            throw new Error(`focusOrigin is not found, looks like the focusPath: ${this.focusPath} is invalid`)
        }

        const bestCandidate = findBestCandidateAmongSiblingsOf(focusOrigin, focusOrigin, direction)
        if (!bestCandidate) return

        this.setFocus(getPathToNode(bestCandidate))
    }
}

function findBestCandidateAmongSiblingsOf(
    treeNode: IFocusableNode,
    focusOrigin: IFocusableNode,
    direction: Direction
): IFocusableNode | null {
    // Focus doesn't move
    if (isDirectionLocked(direction, treeNode.getLock())) return null

    // 2. Search for the best candidate among siblings of the current focusOrigin
    // If not found repeat the same process for the parent FocusableNode's siblings
    // until either the candidate is found or the FocusableRootNode is reached
    const focusableSiblings = getSiblings(treeNode)

    const siblingBoxes = focusableSiblings.map((node) => node.getBoundingBox())
    const siblingsWithinFrustum = boxesWithinFrustumOfOrigin(siblingBoxes, treeNode.getBoundingBox(), direction)
    const bestCandidateBox = getBestCandidate(focusOrigin.getBoundingBox(), siblingsWithinFrustum, direction)
    if (!bestCandidateBox) {
        const parent = treeNode.getParent()
        // Best candidate is not found, so the focus doesn't move
        if (!parent) return null

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

function isDirectionLocked(direction: Direction, lock: Direction[] | Direction | undefined): boolean {
    if (!lock) return false

    if (Array.isArray(lock)) {
        return lock.includes(direction)
    } else {
        return lock === direction
    }
}
