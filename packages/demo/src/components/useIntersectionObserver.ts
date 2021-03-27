import * as React from "react"
import { RefObject } from "react"

export function useIntersectionObserver<T extends HTMLElement>(
    ref: RefObject<T>,
    percentage: number,
    callback: (isIntersecting: boolean) => void
) {
    React.useEffect(() => {
        if (!ref.current) return

        const intersectionObserver = new IntersectionObserver(
            (entries) => {
                const entry = entries[0]
                callback(entry.isIntersecting)
            },
            { threshold: percentage }
        )

        intersectionObserver.observe(ref.current)

        return () => intersectionObserver.disconnect()
    }, [ref, callback, percentage])
}
