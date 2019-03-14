import { createContext } from "react"
import { FocusableTreeNode } from "./types"

export interface FocusableTreeContextValue {
    focusPath: ReadonlyArray<string>
    parentFocusableNode: FocusableTreeNode
    registerFocusable: (focusableTreeNode: FocusableTreeNode) => void
    unregisterFocusable: (focusKey: string) => void
}

export const FocusableTreeContext = createContext<FocusableTreeContextValue>({
    focusPath: [],
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
    },
    registerFocusable: () => {},
    unregisterFocusable: () => {},
})
