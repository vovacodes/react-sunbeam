import * as React from "react"
import { Header } from "../../components/Header.js"
import { Hint } from "../../components/Hint.js"
import { Hero } from "./components/Hero.js"
import { ScrollHint } from "../../components/ScrollHint.js"
import { DemoSelector } from "./components/DemoSelector.js"
import { AnimatePresence, motion } from "framer-motion"

export function Home() {
    const hideScrollHintText = useScrollThreshold({ threshold: 10 })

    return (
        <>
            <Header />
            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                <Hero />
                <DemoSelector />
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
            </div>
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
