import { useState } from "react"
import nanoid from "nanoid"

export function useGeneratedFocusKey(): string {
    // Using useState here to get a reliably-memoized value
    const [focusKey] = useState(() => `focusable:${nanoid()}`)
    return focusKey
}
