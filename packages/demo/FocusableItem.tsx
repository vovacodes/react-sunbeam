import * as React from "react"
import { useRef, useCallback, useEffect } from "react"
import { useFocusable, useSunbeam } from "react-sunbeam"
import { usePrevious } from "./usePrevious"

export type FocusEvent = { element: HTMLElement; focusPath: ReadonlyArray<string> }

type Props = {
    children?: React.ReactNode
    style?: React.CSSProperties | ((focused: boolean) => React.CSSProperties)
    focusKey: string
    onFocus?: (event: FocusEvent) => void
}

/**
 * This is an example of how an abstraction for a "focusable" element can look like in your app.
 * It uses several primitives provided by `react-sunbeam` to create a component specifically tailored
 * to the app. For example `FocusableItem` uses "tap-to-focus" functionality because the app requires it
 * even though `react-sunbeam` doesn't implement it out-of-the-box
 */
export function FocusableItem({ children, style, focusKey, onFocus }: Props) {
    const elementRef = useRef<HTMLDivElement>(null)
    const { focused, path } = useFocusable(focusKey, elementRef)
    const { setFocus } = useSunbeam()

    const prevFocused = usePrevious(focused, focused)
    useEffect(() => {
        if (prevFocused !== focused && focused && onFocus) {
            onFocus({ element: elementRef.current, focusPath: path })
        }
    })

    const handleClick = useCallback(() => {
        setFocus(path)
    }, [path])

    return (
        <div ref={elementRef} style={typeof style === "function" ? style(focused) : style} onClick={handleClick}>
            {children}
        </div>
    )
}
