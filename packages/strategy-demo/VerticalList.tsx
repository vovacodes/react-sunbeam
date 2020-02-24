import * as React from "react"
import { Focusable } from "../react-sunbeam"

type Props = {
    children?: React.ReactNode
    focusKey: string
    style?: React.CSSProperties
}

export default function VerticalList({ focusKey, children, ...rest }: Props) {
    const fullFocusKey = `#vertical#${focusKey}`

    return (
        <Focusable focusKey={fullFocusKey} {...rest}>
            {children}
        </Focusable>
    )
}
