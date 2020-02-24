import * as React from "react"
import { Focusable } from "../react-sunbeam"

type Props = {
    children?: React.ReactNode
    focusKey: string
    style?: React.CSSProperties
}

export default function FocusLock({ focusKey, children, ...rest }: Props) {
    const fullFocusKey = `#FocusLock#${focusKey}`

    return (
        <Focusable focusKey={fullFocusKey} {...rest}>
            {children}
        </Focusable>
    )
}
