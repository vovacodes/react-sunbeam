import * as React from "react"
import { memo, useRef, useEffect, useCallback } from "react"
import { Focusable, useFocusable, useSunbeam } from "react-sunbeam"
import { usePrevious } from "./usePrevious"

type Props = {
    onItemFocus: (itemFocusPath: ReadonlyArray<string>) => void
}

export const ProfilesMenu = memo(function ProfilesMenu({ onItemFocus }: Props) {
    const { setFocus } = useSunbeam()
    const handleItemClick = useCallback((itemFocusPath: ReadonlyArray<string>) => {
        setFocus(itemFocusPath)
    }, [])

    return (
        <Focusable focusKey="profiles" style={{ display: "flex", marginRight: "100px" }}>
            <div style={{ marginRight: "4px" }}>
                <Avatar color="#66BB66" focusKey="1" onClick={handleItemClick} onFocus={onItemFocus} />
            </div>
            <div style={{ marginRight: "4px" }}>
                <Avatar color="#22CCDD" focusKey="2" onClick={handleItemClick} onFocus={onItemFocus} />
            </div>
            <div style={{ marginRight: "4px" }}>
                <Avatar color="#FFEE66" focusKey="3" onClick={handleItemClick} onFocus={onItemFocus} />
            </div>
            <div style={{ marginRight: "4px" }}>
                <Avatar color="#FF88AA" focusKey="4" onClick={handleItemClick} onFocus={onItemFocus} />
            </div>
        </Focusable>
    )
})

function Avatar({
    color,
    focusKey,
    onClick,
    onFocus,
}: {
    color: string
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
                    backgroundColor: color,
                    border: "2px solid black",
                    borderRadius: "50%",
                    boxSizing: "border-box",
                    height: "64px",
                    width: "64px",
                }}
                onClick={handleClick}
            />
        </div>
    )
}
