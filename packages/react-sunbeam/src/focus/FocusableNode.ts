import type { BoundingBox, Direction } from "../spatialNavigation/index.js"
import type { CustomGetPreferredChildFn, FocusKey, IFocusableNode } from "./types.js"
import { assert } from "../shared/assert.js"
import getPreferredNode from "./getPreferredNode.js"

export type FocusableNodesMap = Map<FocusKey, FocusableNode>

export class FocusableNode implements IFocusableNode {
    private readonly revalidateFocusPath: () => void
    private readonly focusKey: FocusKey
    private readonly path: FocusKey[]
    private parent: FocusableNode | undefined
    private readonly children: Map<FocusKey, FocusableNode> = new Map()
    private customGetPreferredChild?: CustomGetPreferredChildFn
    private lock: Direction[] | Direction | undefined

    public readonly getBoundingBox: () => BoundingBox

    constructor({
        focusManagerAPI,
        focusKey,
        parentPath,
        getBoundingBox,
        customGetPreferredChild,
        lock,
    }: {
        focusManagerAPI: { revalidateFocusPath(): void }
        focusKey?: FocusKey
        parentPath: FocusKey[]
        getBoundingBox: () => BoundingBox
        customGetPreferredChild?: CustomGetPreferredChildFn
        lock: Direction[] | Direction | undefined
    }) {
        focusKey = focusKey ?? `focusable:${randomId()}`
        this.focusKey = focusKey
        this.path = [...parentPath, focusKey]
        this.getBoundingBox = getBoundingBox
        this.customGetPreferredChild = customGetPreferredChild
        this.lock = lock

        // Make sure we only call the wrapped function at the end of the event loop cycle and only once.
        this.revalidateFocusPath = deferAndDebounce(() => focusManagerAPI.revalidateFocusPath())
    }

    public registerChild(child: FocusableNode): void {
        const focusKey = child.getFocusKey()
        assert(
            !this.children.has(focusKey),
            `Can't register child with focusKey=${focusKey}. This key is already registered.`
        )
        this.children.set(focusKey, child)
        child.setParent(this)
        this.revalidateFocusPath()
    }

    public unregisterChild(child: FocusableNode): void {
        const focusKey = child.getFocusKey()
        assert(
            this.children.has(focusKey),
            `Can't unregister child with focusKey=${focusKey}. There is no child with such key registered.`
        )
        this.children.delete(focusKey)
        child.unsetParent()
        this.revalidateFocusPath()
    }

    public setCustomGetPreferredChild(customGetPreferredChild: CustomGetPreferredChildFn) {
        this.customGetPreferredChild = customGetPreferredChild
    }

    public setLock(lock: Direction[] | Direction | undefined): void {
        this.lock = lock
    }

    public getPreferredChild(focusOrigin?: IFocusableNode, direction?: Direction) {
        return this.customGetPreferredChild
            ? this.customGetPreferredChild({
                  focusableChildren: this.children,
                  focusOrigin,
                  direction,
              })
            : getPreferredNode({ nodes: this.children, focusOrigin, direction })
    }

    public getFocusKey(): FocusKey {
        return this.path[this.path.length - 1]
    }

    public getPath(): FocusKey[] {
        return this.path
    }

    public getChildren(): FocusableNodesMap {
        return this.children
    }

    public getParent(): FocusableNode | undefined {
        return this.parent
    }

    public getLock(): Direction[] | Direction | undefined {
        return this.lock
    }

    private setParent(parent: FocusableNode): void {
        assert(!this.parent, `Can't replace the already set parent. Use "unsetParent()" before that.`)
        this.parent = parent
    }

    private unsetParent(): void {
        assert(this.parent, `Can't unset parent. It is already unset.`)
        this.parent = undefined
    }
}

let promise: Promise<void> | null
function deferAndDebounce(fn: () => void): () => void {
    return function deferred() {
        if (promise) return

        promise = Promise.resolve().then(() => {
            try {
                fn()
            } catch (err) {
                console.error(err)
            }
            promise = null
        })
    }
}

const BASE62 = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz"
/** Create a random alphanumeric string that can be used as a unique id. */
export function randomId(digits = 10): string {
    return Array(digits)
        .fill(0)
        .map(() => BASE62[Math.floor(Math.random() * BASE62.length)])
        .join("")
}
