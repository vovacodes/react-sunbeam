import * as React from "react"
import { useCallback } from "react"
import { motion } from "framer-motion"
import { SyntheticGamepadKeyEvent, useFocusable, useFocusManager } from "react-sunbeam"
import { keyframes, styled, theme } from "../styles.js"
import { isSelect } from "../keyPressUtils.js"

const StyledButton = styled(motion.button, {
    maxWidth: "300px",
    position: "relative" as const,
    height: "40px",
    border: `2px solid $graphite`,
    borderRadius: "4px",
    paddingLeft: "20px",
    paddingRight: "20px",
    backgroundColor: "$background",
    typography: "bodyText",
    outline: "none",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
})

const ShadowWrapper = styled("div", {
    position: "absolute",
    zIndex: -1,
    width: "100%",
    height: "100%",
    willChange: "transform",
})

const Shadow = styled("div", {
    width: "100%",
    height: "100%",
    borderRadius: "4px",
    boxShadow: "10px 10px 0px 0px $colors$pureBlack",
    willChange: "transform",
    transition: "transform 150ms ease-out",
})

export function Button({
    icon,
    children,
    onPress,
}: {
    icon: React.ReactElement
    children: string
    onPress?: (event: Event) => void
}) {
    const ref = React.useRef<HTMLButtonElement>(null)

    const onKeyDown = React.useCallback(
        (event: KeyboardEvent | SyntheticGamepadKeyEvent) => {
            if (!onPress) return
            if (isSelect(event)) {
                event.preventDefault()
                onPress(event)
            }
        },
        [onPress]
    )

    const { focused, path } = useFocusable({ elementRef: ref, onKeyDown })
    const focusManager = useFocusManager()

    // tap-to-focus
    const handleTap = useCallback(
        (event) => {
            if (!focused) {
                focusManager.setFocus(path)
                return
            }
            onPress?.(event)
        },
        [focused, focusManager, path, onPress]
    )

    return (
        <StyledButton
            ref={ref}
            initial="blurred"
            animate={focused ? "focused" : "blurred"}
            variants={{
                focused: {
                    color: theme.colors.pureBlack.value,
                    borderColor: theme.colors.pureBlack.value,
                },
                blurred: {
                    color: theme.colors.graphite.value,
                    borderColor: theme.colors.graphite.value,
                },
            }}
            transition={{ duration: 0.15 }}
            onTap={handleTap}
        >
            {focused ? React.cloneElement(icon, { focused: true }) : icon}
            <div style={{ width: "10px" }} />
            {children}
            <ShadowWrapper
                css={{
                    animation: focused ? `600ms linear infinite alternate ${keyframes.hovering}` : "none",
                }}
            >
                <Shadow css={{ transform: focused ? "translate(0,0)" : "translate(-8px, -8px)" }} />
            </ShadowWrapper>
        </StyledButton>
    )
}
