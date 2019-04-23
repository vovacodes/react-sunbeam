import { useEffect, useRef } from "react"

export function usePrevious<T, I>(value: T, initialValue?: I): T | I {
    const ref = useRef<T | I>(initialValue)

    // Store current value in ref
    useEffect(() => {
        ref.current = value
    }, [value])

    // Return previous value (happens before update in useEffect above)
    return ref.current
}
