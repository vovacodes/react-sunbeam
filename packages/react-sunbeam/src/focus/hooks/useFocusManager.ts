import { useContext } from "react"
import type { FocusManager } from "../FocusManager.js"
import { FocusManagerContext } from "../FocusManagerContext.js"

export function useFocusManager(): FocusManager | undefined {
    return useContext(FocusManagerContext)
}
