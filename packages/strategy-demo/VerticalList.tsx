import * as React from "react"
import { Focusable, KeyPressListener } from "../react-sunbeam"
import { useCallback } from "react"

type Props = {
    children?: React.ReactNode
    focusKey: string
    style?: React.CSSProperties
    onKeyPress?: KeyPressListener
}

export default function VerticalList({ focusKey, children, ...rest }: Props) {
    const fullFocusKey = `#vertical#${focusKey}`
    // const onFocusReceive = useCallback(({ focusableChildren, focusOrigin, direction }) => {
    //     console.log("onFocusReceive!")
    //     debugger
    // }, [])
    // const onFocus = useCallback((a, b) => {
    //     console.log(a)
    //     console.log(b)
    //     debugger
    // }, [])
    return (
        <Focusable focusKey={fullFocusKey} {...rest}>
            {children}
        </Focusable>
    )
}
