import { useState } from "react"
import nanoid from "nanoid"

export function useGeneratedFocusKey(): string {
    const [focusKey] = useState(() => `focusable:${nanoid()}`)
    return focusKey
}
