import * as React from "react"
import { AnimatePresence, motion } from "framer-motion"
import { Header } from "../../components/Header.js"
import { Hint } from "../../components/Hint.js"
import { Hero } from "./components/Hero.js"
import { ScrollHint } from "../../components/ScrollHint.js"
import { DemoSelector } from "./components/DemoSelector.js"
import { PromoSection } from "./components/PromoSection.js"
import { DirectionalNavigationGraphic } from "./components/DirectionalNavigationGraphic.js"
import { MEDIA_QUERY_PHONE, styled } from "../../styles.js"
import { useMediaQuery } from "../utils/useMediaQuery.js"
import { NoDemoBanner } from "./components/NoDemoBanner.js"

const Main = styled("div", {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
})

export function Home() {
    const hideScrollHintText = useScrollThreshold({ threshold: 10 })

    const isPhone = useMediaQuery(MEDIA_QUERY_PHONE)

    return (
        <>
            <Header />
            <Main>
                <Hero />
                <PromoSection
                    id="directional-navigation"
                    heading="Directional navigation that feels natural"
                    text={
                        <>
                            <p style={{ margin: 0, marginBottom: "6px" }}>
                                React Sunbeam calculates the closest element in the specified direction to pass focus
                                to.
                            </p>
                            <p style={{ margin: 0 }}>
                                It ensures the interaction always feels natural to the user, but also allows fine-tuning
                                that through the flexible API.
                            </p>
                        </>
                    }
                    graphic={<DirectionalNavigationGraphic />}
                />
                {isPhone ? <NoDemoBanner /> : <DemoSelector />}
                <AnimatePresence initial={false}>
                    {!hideScrollHintText && (
                        <motion.div
                            initial={{ opacity: 0, y: "150%" }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: "150%" }}
                            style={{ position: "fixed", bottom: 20 }}
                        >
                            <ScrollHint />
                        </motion.div>
                    )}
                </AnimatePresence>
                <Hint>
                    <div>
                        Navigation - <b>{"↑"}</b>, <b>{"↓"}</b>, <b>{"<-"}</b> and <b>{"->"}</b>
                    </div>
                    <div>
                        Select - <b>Enter</b> or <b>Space</b>
                    </div>
                    <div>
                        Go back - <b>Backspace</b>
                    </div>
                </Hint>
            </Main>
        </>
    )
}

function useScrollThreshold({ threshold }: { threshold: number }) {
    const [passed, dispatch] = React.useReducer((_prevPassed: boolean, passed: boolean) => {
        return passed
    }, false)

    React.useEffect(() => {
        function handleScroll() {
            if (window.scrollY > threshold) {
                return dispatch(true)
            }

            dispatch(false)
        }
        window.addEventListener("scroll", handleScroll)

        return () => window.removeEventListener("scroll", handleScroll)
    }, [threshold, dispatch])

    return passed
}
