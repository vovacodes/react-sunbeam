import * as React from "react"
import { useMemo, useRef } from "react"
import type { Direction } from "../../spatialNavigation/index.js"
import type { KeyPressListener } from "../../keyPressManagement/index.js"
import type { CustomGetPreferredChildFn, FocusEvent } from "../types.js"
import { useFocusable } from "../hooks/useFocusable.js"
import { Branch } from "./Branch.js"

interface Props {
    focusKey?: string
    children: React.ReactNode | ((param: { focused: boolean; path: readonly string[] }) => React.ReactNode)
    focusable?: boolean
    lock?: Direction | Direction[]
    style?: React.CSSProperties
    className?: string
    onKeyPress?: KeyPressListener
    onFocus?: (event: FocusEvent) => void
    onBlur?: (event: FocusEvent) => void
    getPreferredChildOnFocus?: CustomGetPreferredChildFn
}

export function Focusable({
    children,
    className,
    style,
    focusKey,
    focusable = true,
    lock = [],
    getPreferredChildOnFocus,
    onKeyPress,
    onFocus,
    onBlur,
}: Props) {
    const wrapperRef = useRef<HTMLDivElement | null>(null)
    const { focused, path, node } = useFocusable({
        elementRef: wrapperRef,
        focusKey,
        focusable,
        lock,
        onKeyPress,
        onFocus,
        onBlur,
        getPreferredChildOnFocus,
    })

    const renderCallbackArgument = useMemo(() => ({ focused, path }), [focused, path])

    return (
        <Branch node={node}>
            <div ref={wrapperRef} className={className} style={style}>
                {typeof children === "function" ? children(renderCallbackArgument) : children}
            </div>
        </Branch>
    )
}
