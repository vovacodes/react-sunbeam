import * as React from "react"
import { memo, useRef, useEffect } from "react"
import { Focusable, useFocusable } from "react-sunbeam"
import { usePrevious } from "./usePrevious"

type Props = {
    onItemFocus: (itemFocusPath: ReadonlyArray<string>) => void
}

export const NavigationMenu = memo(function NavigationMenu({ onItemFocus }: Props) {
    return (
        <Focusable focusKey="navigationMenu" style={{ display: "flex" }}>
            <div style={{ marginRight: "8px" }}>
                <NavMenuItem focusKey="1" onFocus={onItemFocus} />
            </div>
            <div style={{ marginRight: "8px" }}>
                <NavMenuItem focusKey="2" onFocus={onItemFocus} />
            </div>
            <div style={{ marginRight: "8px" }}>
                <NavMenuItem focusKey="3" onFocus={onItemFocus} />
            </div>
            <div style={{ marginRight: "8px" }}>
                <NavMenuItem focusKey="4" onFocus={onItemFocus} />
            </div>
            <div style={{ marginRight: "8px" }}>
                <NavMenuItem focusKey="5" onFocus={onItemFocus} />
            </div>
            <NavMenuItem focusKey="6" onFocus={onItemFocus} />
        </Focusable>
    )
})

function NavMenuItem({ focusKey, onFocus }: { focusKey: string; onFocus: (focusPath: ReadonlyArray<string>) => void }) {
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
                    backgroundColor: "#505050",
                    boxSizing: "border-box",
                    border: "2px solid black",
                    borderRadius: "50%",
                    height: "92px",
                    width: "92px",
                }}
            />
        </div>
    )
}
