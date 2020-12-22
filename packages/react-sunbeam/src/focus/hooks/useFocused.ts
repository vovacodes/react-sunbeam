import { useEffect, useState } from "react"
import type { FocusKey } from "../types.js"
import { useFocusManagerInternals } from "./useFocusManagerInternals.js"

export function useFocused(focusablePath: readonly FocusKey[]): boolean {
    const focusManagerInternals = useFocusManagerInternals()

    const [focused, setFocused] = useState(() =>
        isPrefixOfPath(focusManagerInternals?.getFocusPath() ?? [], focusablePath)
    )

    useEffect(() => {
        if (focusManagerInternals) {
            return focusManagerInternals.subscribe(({ focusPath }) => {
                setFocused(isPrefixOfPath(focusPath, focusablePath))
            })
        }
    }, [focusManagerInternals, focusablePath, setFocused])

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
