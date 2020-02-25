import { BoundingBox, Direction } from "../spatialNavigation"

export type FocusEvent = {
    getBoundingClientRect: () => ClientRect
    focusablePath: readonly string[]
}

export type GetBoundingBoxFn = () => BoundingBox

export type GetPreferredChildFn = (
    focusOrigin?: FocusableTreeNode,
    direction?: Direction
) => FocusableTreeNode | undefined

export type FocusPath = readonly string[]

export type FocusableTreeNode = {
    focusKey: string
    getParent: () => FocusableTreeNode | undefined
    getBoundingBox: GetBoundingBoxFn
    getChildren: () => Map<string, FocusableTreeNode>
    getPreferredChild: GetPreferredChildFn
}

export type FocusPathValidator = (focusPath: FocusPath, treeRoot: FocusableTreeNode) => FocusPath | null

export type FocusableNodesMap = Map<string, FocusableTreeNode>

export type GetChildrenFn = () => FocusableNodesMap
