import * as React from "react"
import { AnimatePresence, motion } from "framer-motion"
import { Colors } from "../../../styles.js"

const blockSize = "40px"

const boxStyles = { border: `2px solid ${Colors.textBlack}`, borderRadius: "4px" }

export function DirectionalNavigationGraphic() {
    const [step, setStep] = React.useState(0)

    React.useEffect(() => {
        const id = window.setInterval(() => {
            setStep((s) => (s + 1) % 4)
        }, 1500)

        return () => window.clearInterval(id)
    }, [setStep])

    return (
        <div
            style={{
                display: "grid",
                gridTemplateColumns: `${blockSize} ${blockSize} ${blockSize} ${blockSize}`,
                gridTemplateRows: `${blockSize} ${blockSize} ${blockSize}`,
                gap: "8px",
                transform: "skewY(15deg)",
                margin: "80px 0",
            }}
        >
            <motion.div
                animate={{
                    backgroundColor: step === 2 ? Colors.paleCyan : "rgba(179, 253, 255, 0)",
                }}
                transition={{ duration: 0.15 }}
                style={{
                    gridColumnStart: "span 1",
                    gridRowStart: "span 2",
                    ...boxStyles,
                }}
            />
            <motion.div
                animate={{
                    backgroundColor: step === 3 ? Colors.paleCyan : "rgba(179, 253, 255, 0)",
                }}
                transition={{ duration: 0.15 }}
                style={{ gridColumnStart: "span 1", gridRowStart: "span 1", ...boxStyles }}
            />
            <motion.div
                animate={{
                    backgroundColor: step === 0 ? Colors.paleCyan : "rgba(179, 253, 255, 0)",
                }}
                style={{
                    gridColumnStart: "span 1",
                    gridRowStart: "span 1",
                    ...boxStyles,
                }}
            />
            <div style={{ gridColumnStart: "span 1", gridRowStart: "span 1", ...boxStyles }} />
            <motion.div
                animate={{
                    backgroundColor: step === 1 ? Colors.paleCyan : "rgba(179, 253, 255, 0)",
                }}
                transition={{ duration: 0.15 }}
                style={{
                    gridColumnStart: "span 3",
                    gridRowStart: "span 1",
                    ...boxStyles,
                }}
            />
            <div style={{ gridColumnStart: "span 1", gridRowStart: "span 1", ...boxStyles }} />
            <div
                style={{
                    gridColumnStart: "span 2",
                    gridRowStart: "span 1",
                    ...boxStyles,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                <AnimatePresence exitBeforeEnter>
                    {step === 0 ? (
                        <ArrowDown />
                    ) : step === 1 ? (
                        <ArrowLeft />
                    ) : step === 2 ? (
                        <ArrowRight key={step} />
                    ) : step === 3 ? (
                        <ArrowRight key={step} />
                    ) : null}
                </AnimatePresence>
            </div>
            <div
                style={{
                    gridColumnStart: "span 1",
                    gridRowStart: "span 1",
                    ...boxStyles,
                }}
            />
        </div>
    )
}

function ArrowLeft() {
    return (
        <motion.svg
            initial={{ opacity: 0, x: "10px" }}
            animate={{ opacity: 1, x: 0, transition: { delay: 0.7 } }}
            exit={{ opacity: 0, x: 0, transition: { duration: 0.15 } }}
            width="30"
            height="30"
            fill={Colors.textBlack}
            viewBox="0 0 256 256"
        >
            <path
                d="M120,32,24,128l96,96V176h88a8,8,0,0,0,8-8V88a8,8,0,0,0-8-8H120Z"
                fill="none"
                stroke="#000000"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="12"
            />
        </motion.svg>
    )
}

function ArrowDown() {
    return (
        <motion.svg
            initial={{ opacity: 0, y: "-6px" }}
            animate={{ opacity: 1, y: 0, transition: { delay: 0.7 } }}
            exit={{ opacity: 0, y: 0, transition: { duration: 0.15 } }}
            width="30"
            height="30"
            fill={Colors.textBlack}
            viewBox="0 0 256 256"
        >
            <path
                d="M32,136l96,96,96-96H176V48a8,8,0,0,0-8-8H88a8,8,0,0,0-8,8v88Z"
                fill="none"
                stroke="#000000"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="12"
            />
        </motion.svg>
    )
}

function ArrowRight() {
    return (
        <motion.svg
            initial={{ opacity: 0, x: "-10px" }}
            animate={{ opacity: 1, x: 0, transition: { delay: 0.7 } }}
            exit={{ opacity: 0, x: 0, transition: { duration: 0.15 } }}
            width="30"
            height="30"
            fill={Colors.textBlack}
            viewBox="0 0 256 256"
        >
            <path
                d="M136,32l96,96-96,96V176H48a8,8,0,0,1-8-8V88a8,8,0,0,1,8-8h88Z"
                fill="none"
                stroke="#000000"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="12"
            />
        </motion.svg>
    )
}
