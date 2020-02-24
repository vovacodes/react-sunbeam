import { FocusableTreeNode, Direction, getPathToNode } from "../react-sunbeam"

const verticalDirections = [Direction.UP, Direction.DOWN]
const horizontalDirections = [Direction.RIGHT, Direction.LEFT]
const forwardDirections = [Direction.DOWN, Direction.RIGHT]
const backwardDirections = [Direction.UP, Direction.LEFT]

export default function findNestFocusTarget(
    focusOrigin?: FocusableTreeNode,
    direction?: Direction
): FocusableTreeNode | undefined {
    if (!focusOrigin || !direction) {
        return
    }
    // 1. Find the first Parent that is Relevant for the current Direction (Vertical / Horizontal)
    const found = searchFrom(focusOrigin, focusOrigin, direction)
    return found
}

function searchFrom(
    start: FocusableTreeNode,
    origin: FocusableTreeNode,
    direction: Direction
): FocusableTreeNode | undefined {
    const directionParent = getDirectionParent(start, direction)
    if (!directionParent) {
        return
    }
    const focusTarget = getNextChildWithinParent(directionParent, origin, direction)
    if (!focusTarget) {
        return searchFrom(directionParent, origin, direction)
    }
    const focusableLeaf = getFirstFocusableChild(focusTarget, direction)
    return focusableLeaf
}

function getDirectionParent(node: FocusableTreeNode, direction: Direction): FocusableTreeNode | null {
    if (horizontalDirections.indexOf(direction) > -1) {
        return getHorizontalParent(node)
    } else if (verticalDirections.indexOf(direction) > -1) {
        return getVerticalParent(node)
    }
    throw new Error(`Cant find parent for Direction ${direction}`)
}

function getHorizontalParent(node: FocusableTreeNode): FocusableTreeNode | null {
    const parent = node.getParent()
    if (!parent) {
        return null
    }
    if (isHorizontalList(parent)) {
        return parent
    }
    return getHorizontalParent(parent)
}

function getVerticalParent(node: FocusableTreeNode): FocusableTreeNode | null {
    const parent = node.getParent()
    if (!parent) {
        return null
    }
    if (isVerticalList(parent)) {
        return parent
    }
    return getVerticalParent(parent)
}

function isHorizontalList(node: FocusableTreeNode) {
    return node.focusKey.indexOf("#horizontal#") === 0
}

function isVerticalList(node: FocusableTreeNode) {
    return node.focusKey.indexOf("#vertical#") === 0
}
function isHorizontalDirection(direction: Direction) {
    return horizontalDirections.indexOf(direction) > -1
}
function isVerticalDirection(direction: Direction) {
    return verticalDirections.indexOf(direction) > -1
}

function getNextChildWithinParent(searchRoot: FocusableTreeNode, focusOrigin: FocusableTreeNode, direction: Direction) {
    const searchRootPath = getPathToNode(searchRoot)
    const allPossibleChildren = flattenNodesForDirection(searchRoot, focusOrigin, direction)
    const nodeToFocus = getNextFocusedNode(allPossibleChildren, focusOrigin.focusKey, direction)
    return nodeToFocus
}

function sortNodesForDirection(children: Array<FocusableTreeNode>, direction: Direction) {
    return children.sort((a, b) => {
        const key = horizontalDirections.indexOf(direction) > -1 ? "left" : "top"
        const aBox = a.getBoundingBox()
        const bBox = b.getBoundingBox()
        const aValue = aBox[key]
        const bValue = bBox[key]
        if (aValue < bValue) {
            return -1
        } else if (aValue > bValue) {
            return 1
        }
        return 0
    })
}

function isForward(direction: Direction) {
    return forwardDirections.indexOf(direction) > -1
}

function getNextFocusedNode(children: Array<FocusableTreeNode>, startKey: string, direction: Direction) {
    const modifier = isForward(direction) ? 1 : -1
    const currentIndex = children.map(c => c.focusKey).indexOf(startKey)
    const nextIndex = currentIndex + modifier
    const nextElement = children[nextIndex]
    return nextElement
}

function getFirstFocusableChild(node: FocusableTreeNode, direction: Direction): FocusableTreeNode {
    if (isLeaf(node)) {
        return node
    }
    const firstChild = getFirstChild(Array.from(node.getChildren().values()), direction)
    if (!firstChild) {
        return node
    }
    return getFirstFocusableChild(firstChild, direction)
}

function getFirstChild(children: Array<FocusableTreeNode>, direction: Direction): FocusableTreeNode | null {
    const sortedChildren = sortNodesForDirection(children, direction)
    return sortedChildren[0]
}

function isLeaf(node: FocusableTreeNode) {
    return node.getChildren().size === 0
}

function childrenToArray(children: Map<string, FocusableTreeNode>) {
    return Array.from(children.values())
}
function isAutoFocus(node: FocusableTreeNode) {
    return node.focusKey.indexOf("#AutoFocus#") > -1
}

function flattenNodesForDirection(
    root: FocusableTreeNode,
    focusOrigin: FocusableTreeNode,
    direction: Direction
): Array<FocusableTreeNode> {
    let targets: Array<FocusableTreeNode> = []
    const childrenList: Array<FocusableTreeNode> = childrenToArray(root.getChildren())
    const children = sortNodesForDirection(childrenList, direction)
    children.forEach(node => {
        if (isLeaf(node)) {
            targets.push(node)
        } else if (
            (isHorizontalList(node) && isHorizontalDirection(direction)) ||
            (isVerticalList(node) && isVerticalDirection(direction))
        ) {
            targets.push(...flattenNodesForDirection(node, focusOrigin, direction))
        } else {
            const allChildren = flattenNodesForDirection(node, focusOrigin, direction).map(f => f.focusKey)
            if (allChildren.indexOf(focusOrigin.focusKey) > -1) {
                targets.push(focusOrigin)
            } else {
                const preferredChild = node.getPreferredChild()
                if (preferredChild) {
                    targets.push(getFirstFocusableChild(preferredChild, direction))
                }
            }
        }
    })
    return targets
}
