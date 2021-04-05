import * as React from "react"
import { useRef, useState } from "react"
import { useFocusManager } from "react-sunbeam"
import { Logo } from "../../../components/Logo.js"
import { styled, css, MEDIA_QUERY_PHONE } from "../../../styles.js"
import { PageSlide } from "../../../components/PageSlide.js"
import { Button } from "../../../components/Button.js"
import { IconGithub } from "../../../components/icons/IconGithub.js"
import { IconPresentation } from "../../../components/icons/IconPresentation.js"
import { useMediaQuery } from "../../utils/useMediaQuery.js"

const REPO_URL = "https://github.com/vovacodes/react-sunbeam/tree/master/packages/react-sunbeam"

const logoClass = css({
    width: "200px",
    height: "200px",

    "@phone": {
        width: "100px",
        height: "100px",
    },
})

const StyledHero = styled("div", {
    boxSizing: "border-box",
    width: "100%",
    margin: "40px 0",
    padding: "0 20px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    // Better visual alignment
    position: "relative",
    // top: -100,

    "@phone": {
        top: 0,
    },
})

const Heading = styled("h1", {
    marginTop: 0,
    marginBottom: "24px",
    typography: "heading1",
})

const Subtitle = styled("h2", {
    textAlign: "center",
    typography: "subtitle",
})

const ButtonsWrapper = styled("div", {
    width: "100%",
    marginTop: "40px",
    display: "flex",
    justifyContent: "center",
    flexWrap: "wrap",

    "& > *:not(:first-child)": {
        marginLeft: "32px",
    },

    "@phone": {
        "& > *": {
            // Make buttons full-width.
            width: "100%",
        },
        "& > *:not(:first-child)": {
            // marginTop: "32px",
            marginLeft: 0,
        },
    },
})

const slideClass = css({
    "@phone": {
        // To accommodate for the header that is not fixed on mobile.
        //This is required to make auto-scrolling work correctly.
        position: "relative",
        top: -60,
        paddingTop: "60px",
        marginBottom: "-60px",
    },
})

export function Hero() {
    const ref = useRef<HTMLDivElement>(null)

    const [focused, setFocused] = useState(false)
    const focusManager = useFocusManager()

    const isPhone = useMediaQuery(MEDIA_QUERY_PHONE)

    return (
        <PageSlide
            className={slideClass()}
            id="hero"
            ref={ref}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
        >
            <StyledHero>
                <Logo className={logoClass()} solid={focused} />
                <Heading>React Sunbeam</Heading>
                <Subtitle>
                    Spacial navigation and keypress
                    <br />
                    management for React apps
                </Subtitle>
                <ButtonsWrapper>
                    {!isPhone && (
                        <Button
                            icon={<IconPresentation />}
                            onPress={() => {
                                focusManager.setFocus(["demo-selector"])
                            }}
                        >
                            Explore demos
                        </Button>
                    )}
                    <Button
                        icon={<IconGithub />}
                        onPress={() => {
                            window.open(REPO_URL, "_blank") || location.assign(REPO_URL)
                        }}
                    >
                        Read code
                    </Button>
                </ButtonsWrapper>
            </StyledHero>
        </PageSlide>
    )
}
