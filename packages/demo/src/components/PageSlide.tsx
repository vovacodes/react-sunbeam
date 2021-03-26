import * as React from "react"
import { RefObject } from "react"
import { Branch, useFocusable, useFocusManager } from "react-sunbeam"
import { useMergedRef } from "../apps/utils/useMergedRef.js"

export const PageSlide = React.forwardRef(function PageSlide(
    {
        id,
        children,
        onFocus,
        onBlur,
    }: { id: string; children: React.ReactNode; onFocus?: () => void; onBlur?: () => void },
    ref
) {
    const innerRef = React.useRef<HTMLDivElement>(null)

    const isInViewportRef = React.useRef(false)
    const isFocusedRef = React.useRef(false)

    const { node, path } = useFocusable({
        elementRef: innerRef,
        onFocus() {
            isFocusedRef.current = true

            onFocus?.()

            if (isInViewportRef.current) return

            window.scrollTo({ top: innerRef.current?.getBoundingClientRect().top, behavior: "smooth" })
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

    useIntersectionObserver(innerRef, 0.6, onIntersectionUpdate)

    return (
        <Branch node={node}>
            <div
                id={id}
                ref={useMergedRef(innerRef, ref)}
                style={{
                    boxSizing: "border-box",
                    height: "100vh",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                {children}
            </div>
        </Branch>
    )
})

function useIntersectionObserver<T extends HTMLElement>(
    ref: RefObject<T>,
    percentage: number,
    callback: (isIntersecting: boolean) => void
) {
    React.useEffect(() => {
        if (!ref.current) return

        const intersectionObserver = new IntersectionObserver(
            (entries) => {
                const entry = entries[0]
                callback(entry.isIntersecting)
            },
            { threshold: percentage }
        )

        intersectionObserver.observe(ref.current)

        return () => intersectionObserver.disconnect()
    }, [ref, callback, percentage])
}
