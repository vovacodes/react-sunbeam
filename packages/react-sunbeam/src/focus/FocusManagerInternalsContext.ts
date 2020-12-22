import { createContext } from "react"
import type { FocusManager } from "./FocusManager.js"

export const FocusManagerInternalsContext = createContext<FocusManager | undefined>(undefined)
