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

        function findBestCandidateAmongSiblingsOf(
            treeNode: FocusableTreeNode,
            focusOrigin: FocusableTreeNode,
            direction: Direction
        ): FocusableTreeNode | undefined {
            // 2. get all focusable siblings
            const focusableSiblings = getSiblings(treeNode)

            // 3. getBestCandidate(origin, candidates, Direction.RIGHT)
            const siblingBoxes = focusableSiblings.map(node => node.getBoundingBox())

            const bestCandidateBox = getBestCandidate(focusOrigin.getBoundingBox(), siblingBoxes, direction)

            if (!bestCandidateBox) {
                const parent = treeNode.getParent()

                if (!parent) return undefined

                return findBestCandidateAmongSiblingsOf(parent, focusOrigin, direction)
            }

            const bestCandidateIndex = siblingBoxes.indexOf(bestCandidateBox)
            let bestCandidateNode = focusableSiblings[bestCandidateIndex]

            while (bestCandidateNode) {
                if (bestCandidateNode.getChildren().size === 0) {
                    // we found the bestCandidate
                    return bestCandidateNode
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
        }

        const bestCandidate = findBestCandidateAmongSiblingsOf(focusOrigin, focusOrigin, direction)

        if (bestCandidate) {
            this.setFocus(getPathToNode(bestCandidate))
        }
    }
}
