import { useEffect, useState } from "react"
import type { FocusKey } from "../types.js"
import { useFocusManager } from "./useFocusManager.js"

export function useFocused(focusablePath: readonly FocusKey[]): boolean {
    const focusManager = useFocusManager()

    const [focused, setFocused] = useState(() => isPrefixOfPath(focusManager?.getFocusPath() ?? [], focusablePath))

    useEffect(() => {
        if (focusManager) {
            return focusManager.subscribe(({ focusPath }) => {
                setFocused(isPrefixOfPath(focusPath, focusablePath))
            })
        }
    }, [focusManager, focusablePath, setFocused])

    return focused
}

function isPrefixOfPath(path: readonly string[], maybePrefix: readonly string[]): boolean {
    let i = 0
    for (const segment of maybePrefix) {
        if (segment !== path[i]) return false
        i++
    }
    return true
}
