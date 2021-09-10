import * as React from "react"
import { Branch, useFocusable, useFocusManager } from "react-sunbeam"
import { useMergedRef } from "../apps/utils/useMergedRef.js"
import { useIntersectionObserver } from "./useIntersectionObserver.js"
import { styled } from "../styles.js"

const StyledPageSlide = styled("div", {
    boxSizing: "border-box",
    width: "100%",
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",

    "@phone": {
        height: "auto",
    },
})

export const PageSlide = React.forwardRef(function PageSlide(
    {
        id,
        children,
        onFocus,
        onBlur,
        className,
    }: { className?: string; id: string; children: React.ReactNode; onFocus?: () => void; onBlur?: () => void },
    ref
) {
    const innerRef = React.useRef<HTMLDivElement>(null)

    const isInViewportRef = React.useRef(false)
    const isFocusedRef = React.useRef(false)

    const { node, path } = useFocusable({
        focusKey: id,
        elementRef: innerRef,
        onFocus() {
            isFocusedRef.current = true

            onFocus?.()

            if (isInViewportRef.current) return

            window.scrollBy({ top: innerRef.current?.getBoundingClientRect().top, behavior: "smooth" })
        },
        onBlur() {
            isFocusedRef.current = false
            onBlur?.()
        },
    })

    const focusManager = useFocusManager()

    const onIntersectionUpdate = React.useCallback(
        (isIntersecting: boolean) => {
            isInViewportRef.current = isIntersecting

            if (!isIntersecting) return

            if (!isFocusedRef.current) {
                focusManager.setFocus(path)
            }
        },
        [focusManager, path]
    )

    useIntersectionObserver(innerRef, 0.7, onIntersectionUpdate)

    return (
        <Branch node={node}>
            <StyledPageSlide id={id} ref={useMergedRef(innerRef, ref)} className={className}>
                {children}
            </StyledPageSlide>
        </Branch>
    )
})
