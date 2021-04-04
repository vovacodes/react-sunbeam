import * as React from "react"
import { motion } from "framer-motion"
import { useFocusable } from "react-sunbeam"
import { styled, theme, keyframes } from "../styles.js"

const StyledButton = styled(motion.button, {
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

    const onKeyPress = React.useCallback(
        (event: KeyboardEvent) => {
            if (!onPress) return
            if (event.key !== "Enter" && event.key !== " ") return

            event.preventDefault()
            onPress(event)
        },
        [onPress]
    )

    const { focused } = useFocusable({ elementRef: ref, onKeyPress })

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
