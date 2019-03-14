import { useEffect, useRef } from "react"

export default function usePrevious<T>(value: T, initialValue: T): T {
    const ref = useRef<T>(initialValue)

    useEffect(() => {
        ref.current = value
    })

    return ref.current
}
