import { createContext } from "react"
import type { FocusableNode } from "./FocusableNode.js"

export const FocusableParentContext = createContext<FocusableNode | undefined>(undefined)

export const FocusableParentContextProvider = FocusableParentContext.Provider
