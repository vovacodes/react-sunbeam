import * as React from "react"
import { Focusable } from "../react-sunbeam"

type Props = {
    children?: React.ReactNode
    focusKey: string
    style?: React.CSSProperties
}

export default function HorizontalList({ focusKey, children, ...rest }: Props) {
    const fullFocusKey = `#horizontal#${focusKey}`

    return (
        <Focusable focusKey={fullFocusKey} {...rest}>
            {children}
        </Focusable>
    )
}
