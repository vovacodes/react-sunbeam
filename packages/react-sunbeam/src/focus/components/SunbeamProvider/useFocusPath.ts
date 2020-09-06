import { useState, useEffect } from "react"
import type { FocusManager } from "../../FocusManager.js"
import type { FocusPath } from "../../types.js"

export default function useFocusPath(
    focusManager: FocusManager,
    onFocusUpdate?: (event: { focusPath: FocusPath }) => void
) {
    const [focusPath, setFocusPath] = useState(() => focusManager.getFocusPath())

    useEffect(() => {
        return focusManager.subscribe(() => {
            const newFocusPath = focusManager.getFocusPath()

            setFocusPath(newFocusPath)
            if (onFocusUpdate) onFocusUpdate({ focusPath: newFocusPath })
        })
    }, [focusManager, onFocusUpdate])

    return focusPath
}
