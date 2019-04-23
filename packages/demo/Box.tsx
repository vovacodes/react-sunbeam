import * as React from "react"
import { useCallback, useEffect, useRef } from "react"
import { useSunbeam } from "react-sunbeam"
import { usePrevious } from "./usePrevious"

interface Props {
    children: React.ReactNode
    color: string
    focused: boolean
    onFocus?: () => void
    onBlur?: () => void
    path: ReadonlyArray<string>
}

export function Box({ focused, color, children, onFocus, onBlur, path }: Props) {
    const { setFocus } = useSunbeam()
    const prevFocused = usePrevious(focused, focused)

    useEffect(() => {
        if (prevFocused === focused) return

        if (focused && onFocus) {
            onFocus()
            return
        }

        if (onBlur) onBlur()
    }, [prevFocused, focused, onFocus, onBlur])

    const onClick = useCallback(() => {
        setFocus(path)
    }, [path])

    return (
        <div
            style={{
                padding: "10px",
                border: focused ? "1px solid black" : "1px solid transparent",
                borderRadius: "3px",
                backgroundColor: color,
                color: "white",
                fontFamily: "sans-serif",
                transform: focused ? "scale(1.2)" : "scale(1)",
                transition: "transform 100ms ease-in-out",
            }}
            onClick={onClick}
        >
            {children}
        </div>
    )
}
