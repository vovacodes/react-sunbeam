import { useContext } from "react"
import { FocusManagerContext, FocusManagerAPI } from "../FocusManagerContext.js"

/**
 * This hook returns a public subset of the FocusManager API and is intended to be a part of the library's public API.
 */
export function useFocusManager(): FocusManagerAPI {
    return useContext(FocusManagerContext)
}
