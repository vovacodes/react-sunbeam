import * as React from "react"
import { useRef, useCallback } from "react"
import { useFocusable, useSunbeam, FocusEvent, KeyPressListener } from "react-sunbeam"
import { Colors } from "../../styles"

type Props = {
    kind: "circle" | "square"
    color: string
    width: number
    height: number
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
export function FocusableItem({ kind, color, width, height, focusKey, onKeyPress, onFocus, onBlur }: Props) {
    const elementRef = useRef<HTMLDivElement>(null)
    const { focused, path } = useFocusable({
        focusKey,
        elementRef,
        onFocus,
        onBlur,
        onKeyPress,
    })
    const { setFocus } = useSunbeam()

    // tap-to-focus
    const handleClick = useCallback(() => {
        setFocus(path)
    }, [path])

    return (
        <div
            ref={elementRef}
            style={{
                position: "relative",
                border: `2px solid ${Colors.textBlack}`,
                borderRadius: kind === "circle" ? "50%" : undefined,
                transition: "background-color 150ms ease-out",
                boxSizing: "border-box",
                height,
                width,
                backgroundColor: focused ? color : Colors.lightGray,
            }}
            onClick={handleClick}
        >
            <div
                style={{
                    position: "absolute",
                    zIndex: -1,
                    width,
                    height,
                    willChange: "transform",
                    animation: focused ? "600ms linear infinite alternate hovering" : "none",
                }}
            >
                <div
                    style={{
                        width: "100%",
                        height: "100%",
                        boxShadow: `8px 6px 0px 0px ${Colors.textBlack}`,
                        borderRadius: kind === "circle" ? "50%" : undefined,
                        willChange: "transform",
                        transform: focused ? "translate(-2px,-2px)" : "translate(-10px, -8px)",
                        transition: "transform 150ms ease-out",
                    }}
                />
            </div>
        </div>
    )
}
