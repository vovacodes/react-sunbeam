import * as React from "react"
import { useRef, ReactElement } from "react"
import { useHistory } from "react-router-dom"
import { useFocusable } from "react-sunbeam"

export function Home() {
    const history = useHistory()

    return (
        <div
            style={{
                height: "100vh",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
            }}
        >
            <h1
                style={{
                    fontFamily: "Sen, serif",
                    color: "#000000",
                    fontSize: "36px",
                    lineHeight: 1.6,
                    fontWeight: 700,
                }}
            >
                Choose a demo
            </h1>
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                <div style={{ margin: "20px 40px" }}>
                    <FocusableCard
                        title="Console UI"
                        onSelect={() => history.push("/console-ui")}
                        icon={<IconConsole />}
                        background="salmon"
                    />
                </div>
                <div style={{ margin: "20px 40px" }}>
                    <FocusableCard
                        title="Settings menu"
                        onSelect={() => history.push("/settings-menu")}
                        icon={<IconLock />}
                        background="#A3DEEF"
                    />
                </div>
            </div>
            <div
                style={{
                    position: "absolute",
                    bottom: 20,
                    right: 20,
                    fontFamily: `"Fira Code", monospace`,
                    fontSize: 13,
                    lineHeight: 1.6,
                }}
            >
                <div>
                    Navigation - <b>{"<-"}</b> and <b>{"->"}</b>
                </div>
                <div>
                    Select - <b>Enter</b> or <b>Space</b>
                </div>
                <div>
                    Go back - <b>Backspace</b>
                </div>
            </div>
        </div>
    )
}

function FocusableCard({
    title,
    onSelect,
    icon,
    background,
}: {
    title: string
    onSelect: () => void
    icon: ReactElement
    background: string
}) {
    const ref = useRef(null)
    const { focused } = useFocusable({
        elementRef: ref,
        onKeyPress(event) {
            if (event.key !== "Enter" && event.key !== " ") return
            event.preventDefault()
            onSelect()
        },
    })

    return (
        <div
            ref={ref}
            style={{
                display: "flex",
                flexDirection: "column",
            }}
        >
            <div
                style={{
                    position: "relative",
                    width: 160,
                    height: 250,
                    background,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    border: "2px solid black",
                }}
            >
                {/*shadow*/}
                <div
                    style={{
                        position: "absolute",
                        zIndex: -1,
                        width: "100%",
                        height: "100%",
                        boxShadow: "10px 10px 0px 0px rgba(0, 0, 0, 1)",
                        willChange: "transform",
                        opacity: focused ? 1 : 0,
                        transform: focused ? "translate(0,0)" : "translate(-8px, -8px)",
                        transition: "transform 250ms ease-out, opacity 300ms ease-out",
                        animation: focused ? "600ms linear infinite alternate hovering" : "none",
                    }}
                />
                {icon}
            </div>
            <div style={{ marginTop: 10, fontFamily: '"Fira Code", monospace', fontSize: 16 }}>{title}</div>
        </div>
    )
}

function IconConsole() {
    return (
        <svg width="79" height="39">
            <path
                d="M 0.975 8.475 C 0.975 4.899 3.874 2 7.451 2 L 71.549 2 C 75.126 2 78.025 4.899 78.025 8.475 L 78.025 30.525 C 78.025 34.101 75.126 37 71.549 37 L 7.451 37 C 3.874 37 0.975 34.101 0.975 30.525 Z"
                fill="#CCC"
                strokeWidth="0.98"
                stroke="hsl(0, 0%, 3%)"
            />
            <path
                d="M 7.77 8.069 C 9.916 8.069 11.656 9.875 11.656 12.103 C 11.656 14.332 9.916 16.138 7.77 16.138 C 5.625 16.138 3.885 14.332 3.885 12.103 C 3.885 9.875 5.625 8.069 7.77 8.069 Z"
                fill="hsl(0, 0%, 59%)"
                strokeWidth="0.98"
                stroke="hsl(0, 0%, 0%)"
            />
            <path
                d="M 71.23 22.862 C 73.375 22.862 75.115 24.668 75.115 26.897 C 75.115 29.125 73.375 30.931 71.23 30.931 C 69.084 30.931 67.344 29.125 67.344 26.897 C 67.344 24.668 69.084 22.862 71.23 22.862 Z"
                fill="hsl(0, 0%, 59%)"
                strokeWidth="0.98"
                stroke="hsl(0, 0%, 0%)"
            />
            <path
                d="M 5.18 25.552 C 5.896 25.552 6.475 26.154 6.475 26.897 C 6.475 27.639 5.896 28.241 5.18 28.241 C 4.465 28.241 3.885 27.639 3.885 26.897 C 3.885 26.154 4.465 25.552 5.18 25.552 Z"
                fill="#969696"
                strokeWidth="0.98"
                stroke="hsl(0, 0%, 0%)"
            />
            <path
                d="M 10.361 25.552 C 11.076 25.552 11.656 26.154 11.656 26.897 C 11.656 27.639 11.076 28.241 10.361 28.241 C 9.645 28.241 9.066 27.639 9.066 26.897 C 9.066 26.154 9.645 25.552 10.361 25.552 Z"
                fill="#969696"
                strokeWidth="0.98"
                stroke="hsl(0, 0%, 0%)"
            />
            <path
                d="M 7.77 22.862 C 8.486 22.862 9.066 23.464 9.066 24.207 C 9.066 24.95 8.486 25.552 7.77 25.552 C 7.055 25.552 6.475 24.95 6.475 24.207 C 6.475 23.464 7.055 22.862 7.77 22.862 Z"
                fill="#969696"
                strokeWidth="0.98"
                stroke="hsl(0, 0%, 0%)"
            />
            <path
                d="M 7.77 28.241 C 8.486 28.241 9.066 28.843 9.066 29.586 C 9.066 30.329 8.486 30.931 7.77 30.931 C 7.055 30.931 6.475 30.329 6.475 29.586 C 6.475 28.843 7.055 28.241 7.77 28.241 Z"
                fill="#969696"
                strokeWidth="0.98"
                stroke="hsl(0, 0%, 0%)"
            />
            <path
                d="M 68.639 10.759 C 69.355 10.759 69.934 11.361 69.934 12.103 C 69.934 12.846 69.355 13.448 68.639 13.448 C 67.924 13.448 67.344 12.846 67.344 12.103 C 67.344 11.361 67.924 10.759 68.639 10.759 Z"
                fill="#969696"
                strokeWidth="0.98"
                stroke="hsl(0, 0%, 0%)"
            />
            <path
                d="M 73.82 10.759 C 74.535 10.759 75.115 11.361 75.115 12.103 C 75.115 12.846 74.535 13.448 73.82 13.448 C 73.104 13.448 72.525 12.846 72.525 12.103 C 72.525 11.361 73.104 10.759 73.82 10.759 Z"
                fill="#969696"
                strokeWidth="0.98"
                stroke="hsl(0, 0%, 0%)"
            />
            <path
                d="M 71.23 8.069 C 71.945 8.069 72.525 8.671 72.525 9.414 C 72.525 10.157 71.945 10.759 71.23 10.759 C 70.514 10.759 69.934 10.157 69.934 9.414 C 69.934 8.671 70.514 8.069 71.23 8.069 Z"
                fill="#969696"
                strokeWidth="0.98"
                stroke="hsl(0, 0%, 0%)"
            />
            <path
                d="M 71.23 13.448 C 71.945 13.448 72.525 14.05 72.525 14.793 C 72.525 15.536 71.945 16.138 71.23 16.138 C 70.514 16.138 69.934 15.536 69.934 14.793 C 69.934 14.05 70.514 13.448 71.23 13.448 Z"
                fill="#969696"
                strokeWidth="0.98"
                stroke="hsl(0, 0%, 0%)"
            />
            <path d="M 15.605 2.5 L 63.395 2.5 L 63.395 36.5 L 15.605 36.5 Z" fill="#969696" />
            <path
                d="M 18.131 5.379 L 60.869 5.379 L 60.869 33.621 L 18.131 33.621 Z"
                fill="hsl(0, 0%, 41%)"
                strokeWidth="0.98"
                stroke="hsl(0, 0%, 0%)"
            />
            <path d="M 15.605 2 L 15.605 37" fill="transparent" strokeWidth="0.98" stroke="hsl(0, 0%, 0%)" />
            <path d="M 63.395 2 L 63.395 37" fill="transparent" strokeWidth="0.98" stroke="hsl(0, 0%, 0%)" />
        </svg>
    )
}

function IconLock() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="46" height="46">
            <path
                d="M 12.65 13.177 L 12.678 13.177 C 12.66 12.948 12.65 12.716 12.65 12.482 C 12.65 7.494 17.026 3.45 22.425 3.45 C 27.824 3.45 32.2 7.494 32.2 12.482 C 32.2 12.716 32.19 12.948 32.172 13.177 L 32.2 13.177 L 32.2 36.8 L 12.65 36.8 Z"
                fill="transparent"
                strokeWidth="4.6"
                stroke="hsl(0, 0%, 0%)"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M 8.05 19.55 L 36.8 19.55 L 36.8 40.25 L 8.05 40.25 Z"
                fill="#CCC"
                strokeWidth="1.15"
                stroke="hsl(0, 0%, 0%)"
                strokeLinejoin="round"
            />
            <path
                d="M 22.689 25.181 C 24.277 25.181 25.564 26.468 25.564 28.056 C 25.564 29.063 25.046 29.949 24.263 30.463 L 25.3 35.65 L 20.125 35.65 L 21.157 30.489 C 20.35 29.98 19.814 29.081 19.814 28.056 C 19.814 26.468 21.101 25.181 22.689 25.181 Z"
                fill="hsl(0, 0%, 59%)"
                strokeWidth="1.12"
                stroke="hsl(0, 0%, 0%)"
            />
        </svg>
    )
}
