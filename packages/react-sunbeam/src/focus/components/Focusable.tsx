import * as React from "react"
import { useMemo, useRef } from "react"
import type { Direction } from "../../spatialNavigation/index.js"
import type { KeyPressEvent } from "../../keyPressManagement/types.js"
import type { CustomGetPreferredChildFn, FocusEvent } from "../types.js"
import { useFocusable } from "../hooks/useFocusable.js"
import { Branch } from "./Branch.js"

type Props<E = KeyPressEvent> = {
    focusKey?: string
    children: React.ReactNode | ((param: { focused: boolean; path: readonly string[] }) => React.ReactNode)
    focusable?: boolean
    lock?: Direction | Direction[]
    onKeyDown?: (event: E extends KeyPressEvent ? E : unknown) => void
    onFocus?: (event: FocusEvent) => void
    onBlur?: (event: FocusEvent) => void
    getPreferredChildOnFocus?: CustomGetPreferredChildFn
    as?: keyof JSX.IntrinsicElements
} & Omit<React.HTMLAttributes<any>, "children" | "onKeyDown" | "onFocus" | "onBlur">

export function Focusable({
    children,
    focusKey,
    focusable = true,
    lock = [],
    getPreferredChildOnFocus,
    onKeyDown,
    onFocus,
    onBlur,
    as = "div",
    ...htmlProps
}: Props) {
    // This is an unsafe coercion that makes TS happy, but we are fine with that
    // because we only care about `el.getBoundingClientRect()` which all intrinsic elements have.
    const WrapperComponent = as as "div"
    const wrapperRef = useRef<HTMLDivElement | null>(null)

    const { focused, path, node } = useFocusable({
        elementRef: wrapperRef,
        focusKey,
        focusable,
        lock,
        onKeyDown,
        onFocus,
        onBlur,
        getPreferredChildOnFocus,
    })

    const renderCallbackArgument = useMemo(() => ({ focused, path }), [focused, path])

    return (
        <Branch node={node}>
            <WrapperComponent ref={wrapperRef} {...htmlProps}>
                {typeof children === "function" ? children(renderCallbackArgument) : children}
            </WrapperComponent>
        </Branch>
    )
}
