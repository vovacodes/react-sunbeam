import { createContext } from "react"
import type { FocusManager } from "./FocusManager.js"

export const FocusManagerContext = createContext<FocusManager | undefined>(undefined)
