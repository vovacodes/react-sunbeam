import * as React from "react"
import { useRef, useCallback } from "react"
import { useFocusable, useFocusManager, FocusEvent, KeyPressEvent } from "react-sunbeam"
import { motion } from "framer-motion"
import { theme, styled, keyframes } from "../../styles.js"

const StyledFocusableItem = styled(motion.div, {
    position: "relative",
    border: `2px solid $text`,
    boxSizing: "border-box",
    backgroundColor: "$lightGray",
})

const ShadowWrapper = styled("div", {
    position: "absolute",
    zIndex: -1,
    willChange: "transform",
})

const Shadow = styled("div", {
    width: "100%",
    height: "100%",
    boxShadow: `8px 6px 0px 0px $colors$graphite`,
    willChange: "transform",
    transition: "transform 150ms ease-out",
})

/**
 * This is an example of how an abstraction for a "focusable" element can look like in your app.
 * It uses several primitives provided by `react-sunbeam` to create a component specifically tailored
 * to the app. For example `FocusableItem` uses "tap-to-focus" functionality because the app requires it
 * even though `react-sunbeam` doesn't implement it out-of-the-box
 */
export function FocusableItem({
    kind,
    color,
    width,
    height,
    focusKey,
    onKeyDown,
    onFocus,
    onBlur,
}: {
    kind: "circle" | "square"
    color: string
    width: number
    height: number
    focusKey?: string
    onKeyDown?: (event: KeyPressEvent) => void
    onFocus?: (event: FocusEvent) => void
    onBlur?: (event: FocusEvent) => void
}) {
    const elementRef = useRef<HTMLDivElement>(null)
    const { focused, path } = useFocusable({
        focusKey,
        elementRef,
        onFocus,
        onBlur,
        onKeyDown,
    })
    const focusManager = useFocusManager()

    // tap-to-focus
    const handleClick = useCallback(() => {
        focusManager.setFocus(path)
    }, [focusManager, path])

    return (
        <StyledFocusableItem
            ref={elementRef}
            animate={{
                transition: {
                    duration: 0.15,
                },
                backgroundColor: focused ? color : theme.colors.lightGray.value,
            }}
            css={{
                borderRadius: kind === "circle" ? "50%" : undefined,
                height,
                width,
            }}
            onClick={handleClick}
        >
            <ShadowWrapper
                css={{
                    width,
                    height,
                    animation: focused ? `600ms linear infinite alternate ${keyframes.hovering}` : "none",
                }}
            >
                <Shadow
                    css={{
                        borderRadius: kind === "circle" ? "50%" : undefined,
                        transform: focused ? "translate(-2px,-2px)" : "translate(-10px, -8px)",
                    }}
                />
            </ShadowWrapper>
        </StyledFocusableItem>
    )
}
