import { createContext } from "react"
import type { FocusableNodesMap, FocusableTreeNode } from "./types.js"

export interface FocusableTreeContextValue {
    addFocusableToMap: (focusableChildrenMap: FocusableNodesMap, focusableTreeNode: FocusableTreeNode) => void
    removeFocusableFromMap: (focusableChildrenMap: FocusableNodesMap, focusKey: string) => void
    focusPath: readonly string[]
    parentPath: readonly string[]
    parentFocusableNode: FocusableTreeNode
    registerFocusable: (focusableTreeNode: FocusableTreeNode) => void
    unregisterFocusable: (focusKey: string) => void
    dispatchOnFocus: (task: () => void) => void
    dispatchOnBlur: (task: () => void) => void
}

export const FocusableTreeContext = createContext<FocusableTreeContextValue>({
    addFocusableToMap: () => {},
    removeFocusableFromMap: () => {},
    focusPath: [],
    parentPath: [],
    parentFocusableNode: {
        focusKey: "",
        getParent: () => undefined,
        getBoundingBox: () => ({
            left: 0,
            top: 0,
            right: 0,
            bottom: 0,
        }),
        getChildren: () => new Map(),
        getPreferredChild: () => undefined,
        lock: [],
    },
    registerFocusable: () => {},
    unregisterFocusable: () => {},
    dispatchOnFocus: () => {},
    dispatchOnBlur: () => {},
})
