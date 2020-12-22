import { useContext } from "react"
import type { FocusManager } from "../FocusManager.js"
import { FocusManagerInternalsContext } from "../FocusManagerInternalsContext.js"

/**
 * This hook is intended to be used by the library internals, it is not a part of the public API.
 * @private
 */
export function useFocusManagerInternals(): FocusManager | undefined {
    return useContext(FocusManagerInternalsContext)
}
