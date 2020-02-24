import * as React from "react"
import { useRef } from "react"
import { useFocusable } from "../react-sunbeam"

interface Props {
    children?: React.ReactNode
    focusKey: string
}

export default function FocusLock({ focusKey, children }: Props) {
    const elementRef = useRef<HTMLDivElement>(null)
    const fullFocusKey = `#lock#${focusKey}`
    const { focused, path } = useFocusable({
        focusKey: fullFocusKey,
        elementRef,
    })
    return <div ref={elementRef}>{children}</div>
}
