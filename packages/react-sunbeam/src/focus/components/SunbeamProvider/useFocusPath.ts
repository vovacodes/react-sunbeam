import { useState, useEffect } from "react"
import { FocusManager } from "../../FocusManager"

export default function useFocusPath(focusManager: FocusManager) {
    const [focusPath, setFocusPath] = useState(() => focusManager.getFocusPath())

    useEffect(() => {
        return focusManager.subscribe(() => {
            setFocusPath(focusManager.getFocusPath())
        })
    }, [focusManager])

    return focusPath
}
