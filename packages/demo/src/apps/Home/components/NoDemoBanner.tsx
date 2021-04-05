import * as React from "react"
import { styled } from "../../../styles.js"
import { IconPresentation } from "../../../components/icons/IconPresentation.js"

const Banner = styled("div", {
    margin: "20px",
    border: "2px solid $graphite",
    padding: "20px",
    typography: "bodyText",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
})

export function NoDemoBanner() {
    return (
        <Banner>
            <div style={{ marginBottom: "20px" }}>
                <IconPresentation width={40} height={40} focused />
            </div>
            Please visit this website from a desktop to check out the demos. They require a physical desktop keyboard.
        </Banner>
    )
}
