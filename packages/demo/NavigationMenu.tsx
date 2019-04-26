import * as React from "react"
import { memo, useRef, useEffect, useCallback } from "react"
import { Focusable, useFocusable, useSunbeam } from "react-sunbeam"
import { usePrevious } from "./usePrevious"

type Props = {
    onItemFocus: (itemFocusPath: ReadonlyArray<string>) => void
}

export const NavigationMenu = memo(function NavigationMenu({ onItemFocus }: Props) {
    const { setFocus } = useSunbeam()
    const handleItemClick = useCallback((itemFocusPath: ReadonlyArray<string>) => {
        setFocus(itemFocusPath)
    }, [])

    return (
        <Focusable focusKey="navigationMenu" style={{ display: "flex" }}>
            <div style={{ marginRight: "8px" }}>
                <NavMenuItem focusKey="1" onClick={handleItemClick} onFocus={onItemFocus} />
            </div>
            <div style={{ marginRight: "8px" }}>
                <NavMenuItem focusKey="2" onClick={handleItemClick} onFocus={onItemFocus} />
            </div>
            <div style={{ marginRight: "8px" }}>
                <NavMenuItem focusKey="3" onClick={handleItemClick} onFocus={onItemFocus} />
            </div>
            <div style={{ marginRight: "8px" }}>
                <NavMenuItem focusKey="4" onClick={handleItemClick} onFocus={onItemFocus} />
            </div>
            <div style={{ marginRight: "8px" }}>
                <NavMenuItem focusKey="5" onClick={handleItemClick} onFocus={onItemFocus} />
            </div>
            <NavMenuItem focusKey="6" onClick={handleItemClick} onFocus={onItemFocus} />
        </Focusable>
    )
})

function NavMenuItem({
    focusKey,
    onClick,
    onFocus,
}: {
    focusKey: string
    onClick: (focusPath: ReadonlyArray<string>) => void
    onFocus: (focusPath: ReadonlyArray<string>) => void
}) {
    const elementRef = useRef<HTMLDivElement>(null)
    const { focused, path } = useFocusable(focusKey, elementRef)

    const prevFocused = usePrevious(focused, focused)
    useEffect(() => {
        if (prevFocused !== focused && focused && onFocus) onFocus(path)
    }, [prevFocused, focused, onFocus])

    const handleClick = useCallback(() => {
        onClick(path)
    }, [path])

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
                onClick={handleClick}
            />
        </div>
    )
}
