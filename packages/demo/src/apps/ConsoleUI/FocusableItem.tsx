import * as React from "react"
import { useRef, useCallback } from "react"
import { useFocusable, useSunbeam, FocusEvent, KeyPressListener } from "react-sunbeam"

type Props = {
    children?: React.ReactNode
    style?: React.CSSProperties | ((focused: boolean) => React.CSSProperties)
    focusKey: string
    onKeyPress?: KeyPressListener
    onFocus?: (event: FocusEvent) => void
    onBlur?: (event: FocusEvent) => void
}

/**
 * This is an example of how an abstraction for a "focusable" element can look like in your app.
 * It uses several primitives provided by `react-sunbeam` to create a component specifically tailored
 * to the app. For example `FocusableItem` uses "tap-to-focus" functionality because the app requires it
 * even though `react-sunbeam` doesn't implement it out-of-the-box
 */
export function FocusableItem({ children, style, focusKey, onKeyPress, onFocus, onBlur }: Props) {
    const elementRef = useRef<HTMLDivElement>(null)
    const { focused, path } = useFocusable({
        focusKey,
        elementRef,
        onFocus,
        onBlur,
        onKeyPress,
    })
    const sunbeamContextValue = useSunbeam()
    const setFocus = sunbeamContextValue ? sunbeamContextValue.setFocus : undefined

    const handleClick = useCallback(() => {
        if (setFocus) setFocus(path)
    }, [path])

    return (
        <div ref={elementRef} style={typeof style === "function" ? style(focused) : style} onClick={handleClick}>
            {children}
        </div>
    )
}
