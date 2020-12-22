import { useEffect } from "react"
import type { FocusManager } from "../../FocusManager.js"
import type { FocusPath } from "../../types.js"

export default function useOnFocusUpdate(
    focusManager: FocusManager,
    onFocusUpdate?: (event: { focusPath: FocusPath }) => void
) {
    useEffect(() => {
        return focusManager.subscribe(({ focusPath }) => {
            if (!onFocusUpdate) return

            onFocusUpdate({ focusPath })
        })
    }, [focusManager, onFocusUpdate])
}
