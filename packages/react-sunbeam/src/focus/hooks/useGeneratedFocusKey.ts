import { useState } from "react"

export function useGeneratedFocusKey(): string {
    // Using useState here to get a reliably-memoized value
    const [focusKey] = useState(() => `focusable:${randomId()}`)
    return focusKey
}

const BASE62 = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz"

/** Create a random alphanumeric string that can be used as a unique id. */
export function randomId(digits = 10): string {
    return Array(digits)
        .fill(0)
        .map(() => BASE62[Math.floor(Math.random() * BASE62.length)])
        .join("")
}
