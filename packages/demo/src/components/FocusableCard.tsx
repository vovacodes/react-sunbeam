import * as React from "react"
import { ReactElement, useCallback, useRef } from "react"
import { useFocusable, useFocusManager } from "react-sunbeam"
import { keyframes, styled } from "../styles.js"
import { isSelect } from "../keyPressUtils.js"

const Poster = styled("div", {
    position: "relative",
    width: 160,
    height: 250,
    borderRadius: "4px",
    backgroundColor: "$background",
})

const BackgroundWrapper = styled("div", {
    position: "absolute",
    width: "100%",
    height: "100%",
    overflow: "hidden",
})

const Title = styled("div", {
    marginTop: 10,
    typography: "bodyText",
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
    boxShadow: "10px 10px 0px 0px rgba(0, 0, 0, 1)",
    willChange: "transform",
    transition: "transform 150ms ease-out",
})

export function FocusableCard({
    title,
    onPress,
    icon,
    background,
}: {
    title: string
    onPress: () => void
    icon: ReactElement
    background: ReactElement<{ grayscale: boolean }>
}) {
    const ref = useRef(null)
    const { focused, path } = useFocusable({
        elementRef: ref,
        onKeyDown(event) {
            if (isSelect(event)) {
                event.preventDefault()
                onPress()
            }
        },
    })
    const focusManager = useFocusManager()

    // tap-to-focus
    const handleTap = useCallback(() => {
        if (!focused) {
            focusManager.setFocus(path)
            return
        }
        onPress?.()
    }, [focused, focusManager, path, onPress])

    return (
        <div
            ref={ref}
            style={{
                display: "flex",
                flexDirection: "column",
            }}
            onClick={handleTap}
        >
            <Poster css={{ border: `2px solid ${focused ? "$pureBlack" : "$text"}` }}>
                <BackgroundWrapper>{React.cloneElement(background, { grayscale: !focused })}</BackgroundWrapper>
                <ShadowWrapper
                    css={{ animation: focused ? `600ms linear infinite alternate ${keyframes.hovering}` : "none" }}
                >
                    <Shadow css={{ transform: focused ? "translate(0,0)" : "translate(-8px, -8px)" }} />
                </ShadowWrapper>
                <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)" }}>
                    {icon}
                </div>
            </Poster>
            <Title css={{ color: focused ? "$pureBlack" : "$text" }}>{title}</Title>
        </div>
    )
}
