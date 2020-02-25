import * as React from "react"
import { Focusable } from "../react-sunbeam"

type Props = {
    children?: React.ReactNode
    focusKey: string
    style?: React.CSSProperties
    disabled?: boolean
}

export default function FocusLock({ focusKey, children, disabled, ...rest }: Props) {
    const fullFocusKey = disabled ? focusKey : `#FocusLock#${focusKey}`
    return (
        <Focusable focusKey={fullFocusKey} {...rest}>
            {children}
        </Focusable>
    )
}
