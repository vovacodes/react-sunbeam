import * as React from "react"
import { memo, useRef, useEffect } from "react"
import { Focusable, useFocusable } from "react-sunbeam"
import { usePrevious } from "./usePrevious"

type Props = {
    onItemFocus: (itemFocusPath: ReadonlyArray<string>) => void
}

export const ProfilesMenu = memo(function ProfilesMenu({ onItemFocus }: Props) {
    return (
        <Focusable focusKey="profiles" style={{ display: "flex", marginRight: "100px" }}>
            <div style={{ marginRight: "4px" }}>
                <Avatar color="#66BB66" focusKey="1" onFocus={onItemFocus} />
            </div>
            <div style={{ marginRight: "4px" }}>
                <Avatar color="#22CCDD" focusKey="2" onFocus={onItemFocus} />
            </div>
            <div style={{ marginRight: "4px" }}>
                <Avatar color="#FFEE66" focusKey="3" onFocus={onItemFocus} />
            </div>
            <div style={{ marginRight: "4px" }}>
                <Avatar color="#FF88AA" focusKey="4" onFocus={onItemFocus} />
            </div>
        </Focusable>
    )
})

function Avatar({
    color,
    focusKey,
    onFocus,
}: {
    color: string
    focusKey: string
    onFocus: (focusPath: ReadonlyArray<string>) => void
}) {
    const elementRef = useRef<HTMLDivElement>(null)
    const { focused, path } = useFocusable(focusKey, elementRef)

    const prevFocused = usePrevious(focused, focused)
    useEffect(() => {
        if (prevFocused !== focused && focused && onFocus) onFocus(path)
    }, [prevFocused, focused, onFocus])

    return (
        <div
            style={{
                border: focused ? "4px solid cyan" : "4px solid transparent",
                borderRadius: "50%",
                transition: "border-color 100ms ease-out",
            }}
        >
            <div
                ref={elementRef}
                style={{
                    backgroundColor: color,
                    border: "2px solid black",
                    borderRadius: "50%",
                    boxSizing: "border-box",
                    height: "64px",
                    width: "64px",
                }}
            />
        </div>
    )
}
