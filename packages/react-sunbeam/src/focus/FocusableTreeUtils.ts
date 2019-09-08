import { FocusableNodesMap, FocusableTreeNode, FocusPath } from "./types"
import { FOCUSABLE_TREE_ROOT_KEY } from "./Constants"

export function validateAndFixFocusPathIfNeeded(focusPath: FocusPath, treeRoot: FocusableTreeNode): FocusPath | null {
    let fixedFocusPath: string[] | null = null // only initialize if we need to fix the path
    let focusedNode: FocusableTreeNode = treeRoot
    let focusPathSegmentIndex = 0

    while (focusedNode) {
        const focusedChildKey: string | undefined = fixedFocusPath
            ? fixedFocusPath[focusPathSegmentIndex]
            : focusPath[focusPathSegmentIndex]
        const focusableChildren: FocusableNodesMap = focusedNode.getChildren()
        if (focusableChildren.size === 0) {
            // leaf node
            if (focusPath.length >= focusPathSegmentIndex + 1 && !fixedFocusPath) {
                // discard the rest of the path starting with `focusPathSegmentIndex` as invalid
                fixedFocusPath = focusPath.slice(0, focusPathSegmentIndex)
            }
            break
        }

        if (!focusableChildren.has(focusedChildKey)) {
            const preferredChild: FocusableTreeNode | undefined = focusedNode.getPreferredChild()
            if (!preferredChild) {
                throw new Error(
                    `can not find a preferred child to focus ` + `in node with focusKey=${focusedNode.focusKey}`
                )
            }
            if (!fixedFocusPath) {
                fixedFocusPath = focusPath.slice(0, focusPathSegmentIndex)
            }
            fixedFocusPath.push(preferredChild.focusKey)
            focusedNode = preferredChild
            focusPathSegmentIndex++
            continue
        }

        // move to the next focused child
        focusedNode = focusableChildren.get(focusedChildKey) as FocusableTreeNode // we already checked for existence above
        focusPathSegmentIndex++
    }

    return fixedFocusPath ? fixedFocusPath : null
}

export function getNodeByPath(path: FocusPath, treeRoot: FocusableTreeNode): FocusableTreeNode | undefined {
    return path.reduce((node: FocusableTreeNode | undefined, focusKey: string) => {
        if (node === undefined) return undefined

        return node.getChildren().get(focusKey)
    }, treeRoot)
}

export function getPathToNode(treeNode: FocusableTreeNode): FocusPath {
    const path: string[] = []

    let currentNode: FocusableTreeNode | undefined = treeNode
    while (currentNode) {
        const focusKey = currentNode.focusKey

        // we don't include the root key in the path
        if (focusKey !== FOCUSABLE_TREE_ROOT_KEY) {
            path.unshift(focusKey)
        }

        currentNode = currentNode.getParent()
    }

    return path
}

export function getSiblings(focusableTreeNode: FocusableTreeNode): readonly FocusableTreeNode[] {
    const parent = focusableTreeNode.getParent()
    const siblings: FocusableTreeNode[] = []

    if (!parent) return siblings

    for (const child of parent.getChildren().values()) {
        if (child !== focusableTreeNode) {
            siblings.push(child)
        }
    }

    return siblings
}
