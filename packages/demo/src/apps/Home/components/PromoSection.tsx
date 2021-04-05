import * as React from "react"
import { useState } from "react"
import { motion } from "framer-motion"
import { styled, theme } from "../../../styles.js"
import { PageSlide } from "../../../components/PageSlide.js"

const Grid = styled("div", {
    width: "100%",
    maxWidth: "950px",
    border: `2px solid $graphite`,
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))",

    // Imitate inter-cell borders
    backgroundColor: "$graphite",
    gap: "2px",

    "@phone": {
        border: "none",
        backgroundColor: "$background",
    },
})

const Heading = styled(motion.h2, {
    margin: 0,
    padding: "16px 16px 16px 40px",
    gridColumnStart: "span 1",
    gridRowStart: "span 1",
    typography: "heading2",

    "@phone": {
        paddingLeft: "20px",
    },
})

const Text = styled("div", {
    padding: "16px 16px 16px 40px",
    gridColumnStart: "span 1",
    gridRowStart: "2",
    backgroundColor: "$background",
    typography: "bodyText",

    "@phone": {
        paddingLeft: "20px",
    },
})

const Figure = styled("figure", {
    margin: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gridColumnStart: "span 1",
    gridRowStart: "span 2",
    backgroundColor: "$background",
})

export function PromoSection({
    id,
    heading,
    text,
    graphic,
}: {
    id: string
    heading: React.ReactNode
    text: React.ReactNode
    graphic: React.ReactNode
}) {
    const [focused, setFocused] = useState(false)

    return (
        <PageSlide id={id} onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}>
            <Grid>
                <Heading animate={{ background: focused ? theme.colors.sunRed.value : theme.colors.pastelWhite.value }}>
                    {heading}
                </Heading>
                <Text>{text}</Text>
                <Figure>{graphic}</Figure>
            </Grid>
        </PageSlide>
    )
}
