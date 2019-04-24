import * as React from "react"
import { useEffect, useRef } from "react"
import { useFocusable } from "react-sunbeam"
import { usePrevious } from "./usePrevious"

type Props = {
    children: React.ReactNode
    focusKey: string
    onFocus?: (params: { focusPath: ReadonlyArray<string>; element: HTMLDivElement }) => void
}

export function FocusableCircle({ focusKey, children, onFocus }: Props) {
    const circleRef = useRef<HTMLDivElement>()

    const { focused, path } = useFocusable(focusKey, circleRef)
    const prevFocused = usePrevious(focused, focused)

    useEffect(() => {
        if (prevFocused !== focused && focused && onFocus) onFocus({ focusPath: path, element: circleRef.current })
    }, [prevFocused, focused, onFocus])

    return (
        <div
            ref={circleRef}
            style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                width: "100px",
                height: "100px",
                border: `2px solid ${focused ? "black" : "lightgray"}`,
                borderRadius: "50%",
                fontSize: "48px",
                marginBottom: "10px",
                transition: "border-color 300ms ease-out",
            }}
        >
            {children}
        </div>
    )
}
