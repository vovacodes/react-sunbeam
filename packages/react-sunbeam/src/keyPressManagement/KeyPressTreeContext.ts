import { createContext, useContext } from "react"
import { KeyPressTreeNode } from "./types"

export interface KeyPressTreeContextValue {
    registerActiveKeyPressTreeNode?: (node: KeyPressTreeNode) => void
    unregisterActiveKeyPressTreeNode?: (node: KeyPressTreeNode) => void
}

const KeyPressTreeContext = createContext<KeyPressTreeContextValue>({})

export const KeyPressTreeContextProvider = KeyPressTreeContext.Provider

export function useKeyPressTreeContext(): KeyPressTreeContextValue {
    return useContext(KeyPressTreeContext)
}
