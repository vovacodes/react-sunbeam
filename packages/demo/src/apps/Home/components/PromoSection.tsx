import * as React from "react"
import { useRef, useState } from "react"
import { motion } from "framer-motion"
import { Colors, Typography } from "../../../styles.js"
import { PageSlide } from "../../../components/PageSlide.js"

const BORDER_STYLE = `2px solid ${Colors.textBlack}`

export function PromoSection({ id, heading, text }: { id: string; heading: React.ReactNode; text: React.ReactNode }) {
    const [focused, setFocused] = useState(false)

    return (
        <PageSlide id={id} onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}>
            <motion.div
                animate={{
                    background: focused ? Colors.sunRed : "rgba(242, 135, 135, 0)",
                }}
                style={{
                    maxWidth: "870px",
                    border: BORDER_STYLE,
                    display: "grid",
                    gridTemplateColumns: "50% 50%",
                    gridTemplateRows: "auto auto",
                    gridTemplateAreas: `'heading illustration'
                                        'body    illustration'`,
                }}
            >
                <h2
                    style={{
                        margin: 0,
                        borderBottom: BORDER_STYLE,
                        padding: "16px 16px 16px 40px",
                        gridArea: "heading",
                        ...Typography.heading2,
                    }}
                >
                    {heading}
                </h2>
                <div style={{ padding: "16px 16px 16px 40px", gridArea: "body", ...Typography.bodyText }}>{text}</div>
                <div style={{ gridArea: "illustration", borderLeft: BORDER_STYLE }}>YOYOYOO</div>
            </motion.div>
        </PageSlide>
    )
}
