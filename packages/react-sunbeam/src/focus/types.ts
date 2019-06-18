import { BoundingBox, Direction } from "../spatialNavigation"

export type GetBoundingBoxFn = () => BoundingBox

export type GetPreferredChildFn = (
    focusOrigin?: FocusableTreeNode,
    direction?: Direction
) => FocusableTreeNode | undefined

export type FocusPath = readonly string[]

export interface FocusableTreeNode {
    focusKey: string
    getParent: () => FocusableTreeNode | undefined
    getBoundingBox: GetBoundingBoxFn
    getChildren: () => Map<string, FocusableTreeNode>
    getPreferredChild: GetPreferredChildFn
}

export type FocusableNodesMap = Map<string, FocusableTreeNode>

export type GetChildrenFn = () => FocusableNodesMap
