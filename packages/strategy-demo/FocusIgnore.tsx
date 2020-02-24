import * as React from "react"
import { Focusable } from "../react-sunbeam/dist/es"

type Props = {
    active: boolean
    children?: React.ReactNode
    focusKey: string
    style?: React.CSSProperties
}

export default function IgnoreFocus({ focusKey, active, children, ...rest }: Props) {
    const fullFocusKey = active ? `#ignore#active#${focusKey}` : `#ignore#${focusKey}`

    return (
        <Focusable focusKey={fullFocusKey} {...rest}>
            {children}
        </Focusable>
    )
}
