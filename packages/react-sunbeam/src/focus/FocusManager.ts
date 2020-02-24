import { FocusableTreeNode, FocusPath } from "./types"
import { getNodeByPath, getPathToNode, validateAndFixFocusPathIfNeeded } from "./FocusableTreeUtils"
import { Direction } from "../spatialNavigation"
import findBestCandidateAmongSiblingsOf from "./strategies/bestCandidateAmongSiblings"
import { GetPreferredChildFn } from "./types"

interface Options {
    initialFocusPath: FocusPath
    strategy?: GetPreferredChildFn
}

const defaultOptions: Options = {
    initialFocusPath: [],
    strategy: findBestCandidateAmongSiblingsOf,
}

export class FocusManager {
    /**
     * path from the focusableRoot to the focusTarget.
     */
    private focusPath: readonly string[]
    private focusableRoot: FocusableTreeNode | undefined
    private subscribers: Set<Function>
    private strategy: GetPreferredChildFn

    public constructor(options: Options = defaultOptions) {
        this.focusPath = options.initialFocusPath
        this.strategy = options.strategy || (defaultOptions.strategy as GetPreferredChildFn)
        this.subscribers = new Set()
    }

    public setFocusableRoot(focusableRoot: FocusableTreeNode): void {
        this.focusableRoot = focusableRoot

        this.revalidateFocusPath()
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

    public revalidateFocusPath() {
        if (!this.focusableRoot) {
            this.setFocus([])
            return
        }

        const fixedFocusPath = validateAndFixFocusPathIfNeeded(this.focusPath, this.focusableRoot)
        if (fixedFocusPath) {
            this.setFocus(fixedFocusPath)
        }
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

        const bestCandidate = this.strategy(focusOrigin, direction)
        if (!bestCandidate) return

        this.setFocus(getPathToNode(bestCandidate))
    }
}
