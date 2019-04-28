import { FocusableNodesMap, FocusableTreeNode, FocusPath } from "./types"
import { FOCUSABLE_TREE_ROOT_KEY } from "./Constants"

export function validateAndFixFocusPathIfNeeded(focusPath: FocusPath, treeRoot: FocusableTreeNode): FocusPath | null {
    let fixedFocusPath: string[] | null = null

    function addFixToFocusPath(index: number, focusKey: string | null) {
        // lazily initialize fixedFocusPath
        if (!fixedFocusPath) {
            fixedFocusPath = Array.from(focusPath)
        }

        if (focusKey === null) {
            // delete the rest of the path starting with `index`
            fixedFocusPath.splice(index)
            return
        }

        fixedFocusPath[index] = focusKey
    }

    let focusPathSegmentIndex = 0
    let focusedNode: FocusableTreeNode | undefined = treeRoot
    while (focusedNode) {
        const focusedChildKey: string | undefined = focusPath[focusPathSegmentIndex]
        const children: FocusableNodesMap = focusedNode.getChildren()

        if (children.size === 0) {
            // we reached the focused leaf of the tree
            if (focusedChildKey != null) {
                addFixToFocusPath(focusPathSegmentIndex, null)
            }
            break
        }

        if (children.has(focusedChildKey)) {
            // move to the next focused child
            focusedNode = children.get(focusedChildKey)
            focusPathSegmentIndex++
            continue
        }

        const preferredChild = focusedNode.getPreferredChild()

        if (!preferredChild) {
            throw new Error(
                `can not find a preferred child to focus ` + `in node with focusKey=${focusedNode.focusKey}`
            )
        }

        addFixToFocusPath(focusPathSegmentIndex, preferredChild.focusKey)
        focusedNode = preferredChild
        focusPathSegmentIndex++
    }

    if (fixedFocusPath !== null) {
        return fixedFocusPath
    }

    return null
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

export function getSiblings(focusableTreeNode: FocusableTreeNode): ReadonlyArray<FocusableTreeNode> {
    const parent = focusableTreeNode.getParent()
    const siblings: FocusableTreeNode[] = []

    if (!parent) return siblings

    for (let child of parent.getChildren().values()) {
        if (child !== focusableTreeNode) {
            siblings.push(child)
        }
    }

    return siblings
}
