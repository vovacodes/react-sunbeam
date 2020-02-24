import * as React from "react"
import { FocusableItem } from "./FocusableItem"
import { FocusEvent } from "../react-sunbeam"

type Props = {
    focusKey: string
    onFocus?: (event: FocusEvent) => void
    onBlur?: (event: FocusEvent) => void
}

export default function StyledFocusItem({ focusKey, onFocus, onBlur }: Props) {
    return (
        <FocusableItem
            focusKey={focusKey}
            style={focused => ({
                border: focused ? "4px solid cyan" : "4px solid transparent",
                borderRadius: "50%",
                transition: "border-color 100ms ease-out",
            })}
            onFocus={onFocus}
            onBlur={onBlur}
        >
            {focusKey}
        </FocusableItem>
    )
}
