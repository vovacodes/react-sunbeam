import type { FocusPath, IFocusableNode } from "./types.js"
import { FOCUSABLE_TREE_ROOT_KEY } from "./Constants.js"

export function validateAndFixFocusPathIfNeeded(focusPath: FocusPath, treeRoot: IFocusableNode): FocusPath | null {
    let fixedFocusPath: string[] | null = null // only initialize if we need to fix the path
    let currentNode = treeRoot
    let focusPathSegmentIndex = 0

    while (currentNode) {
        const focusedChildKey: string | undefined = fixedFocusPath
            ? fixedFocusPath[focusPathSegmentIndex]
            : focusPath[focusPathSegmentIndex]
        const focusableChildren = currentNode.getChildren()
        if (focusableChildren.size === 0) {
            // leaf node
            if (focusPath.length >= focusPathSegmentIndex + 1 && !fixedFocusPath) {
                // discard the rest of the path starting with `focusPathSegmentIndex` as invalid
                fixedFocusPath = focusPath.slice(0, focusPathSegmentIndex)
            }
            break
        }

        const focusableNode = focusableChildren.get(focusedChildKey)
        if (!focusableNode) {
            const preferredChild = currentNode.getPreferredChild()
            if (!preferredChild) {
                throw new Error(
                    `can not find a preferred child to focus ` + `in node with focusKey=${currentNode.getFocusKey()}`
                )
            }
            if (!fixedFocusPath) {
                fixedFocusPath = focusPath.slice(0, focusPathSegmentIndex)
            }
            fixedFocusPath.push(preferredChild.getFocusKey())
            currentNode = preferredChild
            focusPathSegmentIndex++
            continue
        }

        // move to the next focused child
        currentNode = focusableNode
        focusPathSegmentIndex++
    }

    return fixedFocusPath ? fixedFocusPath : null
}

export function getNodeByPath(path: FocusPath, treeRoot: IFocusableNode): IFocusableNode | undefined {
    return path.reduce((node: IFocusableNode | undefined, focusKey: string) => {
        if (node === undefined) return undefined

        return node.getChildren().get(focusKey)
    }, treeRoot)
}

export function getPathToNode(treeNode: IFocusableNode): FocusPath {
    const path: string[] = []

    let currentNode: IFocusableNode | undefined = treeNode
    while (currentNode) {
        const focusKey = currentNode.getFocusKey()

        // we don't include the root key in the path
        if (focusKey !== FOCUSABLE_TREE_ROOT_KEY) {
            path.unshift(focusKey)
        }

        currentNode = currentNode.getParent()
    }

    return path
}

export function getSiblings(focusableTreeNode: IFocusableNode): readonly IFocusableNode[] {
    const parent = focusableTreeNode.getParent()
    const siblings: IFocusableNode[] = []

    if (!parent) return siblings

    for (const child of parent.getChildren().values()) {
        if (child !== focusableTreeNode) {
            siblings.push(child)
        }
    }

    return siblings
}
