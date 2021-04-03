import * as React from "react"
import { motion } from "framer-motion"
import { useFocusable } from "react-sunbeam"
import { Colors, Typography } from "../styles.js"

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

            onPress(event)
        },
        [onPress]
    )

    const { focused } = useFocusable({ elementRef: ref, onKeyPress })

    const style = {
        position: "relative" as const,
        height: "40px",
        border: `2px solid ${Colors.textBlack}`,
        borderRadius: "4px",
        paddingLeft: "20px",
        paddingRight: "20px",
        background: Colors.background,
        ...Typography.bodyText,
        outline: "none",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
    }
    if (focused) {
        style.color = "black"
        icon = React.cloneElement(icon, { focused: true })
    }

    return (
        <motion.button
            ref={ref}
            animate={{ borderColor: focused ? "black" : Colors.textBlack }}
            transition={{ duration: 0.15 }}
            style={style}
        >
            {icon}
            <div style={{ width: "10px" }} />
            {children}
            {/*shadow*/}
            <div
                style={{
                    position: "absolute",
                    zIndex: -1,
                    width: "100%",
                    height: "100%",
                    willChange: "transform",
                    animation: focused ? "600ms linear infinite alternate hovering" : "none",
                }}
            >
                <div
                    style={{
                        width: "100%",
                        height: "100%",
                        borderRadius: "4px",
                        boxShadow: "10px 10px 0px 0px rgba(0, 0, 0, 1)",
                        willChange: "transform",
                        transform: focused ? "translate(0,0)" : "translate(-8px, -8px)",
                        transition: "transform 150ms ease-out",
                        // animation: focused ? "600ms linear infinite alternate hovering" : "none",
                    }}
                />
            </div>
        </motion.button>
    )
}
