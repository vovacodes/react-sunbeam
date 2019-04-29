import { FocusableTreeNode, FocusPath } from "./types"
import { getNodeByPath, getPathToNode, getSiblings, validateAndFixFocusPathIfNeeded } from "./FocusableTreeUtils"
import { Direction, getBestCandidate } from "../spatialNavigation"

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
    private focusPath: ReadonlyArray<string>
    private focusableRoot: FocusableTreeNode | undefined
    private subscribers: Set<Function>

    public constructor(options: Options = defaultOptions) {
        this.focusPath = options.initialFocusPath

        this.subscribers = new Set()
    }

    public setFocusableRoot(focusableRoot: FocusableTreeNode): void {
        this.focusableRoot = focusableRoot

        const fixedFocusPath = validateAndFixFocusPathIfNeeded(this.focusPath, this.focusableRoot)

        if (fixedFocusPath) {
            this.setFocus(fixedFocusPath)
        }
    }

    public clearFocusableRoot(): void {
        this.focusableRoot = undefined
    }

    public setFocus(focusPath: FocusPath): void {
        this.focusPath = focusPath
        this.notifySubscribers()
    }

    public getFocusPath(): FocusPath {
        return this.focusPath
    }

    public subscribe(subscriber: () => void): () => void {
        this.subscribers.add(subscriber)

        return () => {
            this.subscribers.delete(subscriber)
        }
    }

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

    // ===================================
    // Private methods
    // ===================================

    private notifySubscribers(): void {
        this.subscribers.forEach(subscriber => {
            subscriber()
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
    treeNode: FocusableTreeNode,
    focusOrigin: FocusableTreeNode,
    direction: Direction
): FocusableTreeNode | null {
    // 2. Search for the best candidate among siblings of the current focusOrigin
    // If not found repeat the same process for the parent FocusableNode's siblings
    // until either the candidate is found or the FocusableRootNode is reached
    const focusableSiblings = getSiblings(treeNode)

    const siblingBoxes = focusableSiblings.map(node => node.getBoundingBox())
    const bestCandidateBox = getBestCandidate(focusOrigin.getBoundingBox(), siblingBoxes, direction)
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

        const preferredChild = bestCandidateNode.getPreferredChild(focusOrigin.getBoundingBox(), direction)
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
