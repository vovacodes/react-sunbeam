import * as React from "react"
import { memo, useCallback, useRef, useState } from "react"
import { useFocusable, Focusable } from "react-sunbeam"
import { usePrevious } from "./usePrevious"
import { useEffect } from "react"

type Props = {
    onItemFocus: (itemFocusPath: ReadonlyArray<string>) => void
}

export const GamesGallery = memo(function GamesGallery({ onItemFocus }: Props) {
    const viewportRef = useRef<HTMLDivElement>(null)
    const [scrollX, setScrollX] = useState<number>(0)

    const handleItemFocus = useCallback(
        ({ focusPath, element }: { focusPath: ReadonlyArray<string>; element: HTMLDivElement }) => {
            const viewport = viewportRef.current
            const { width: viewportWidth, left: viewportLeft } = viewport.getBoundingClientRect()

            const { left: elementLeft, width: elementWidth } = element.getBoundingClientRect()
            const elementOffsetLeft = elementLeft - viewportLeft
            const elementRightEdge = elementOffsetLeft + elementWidth

            if (elementLeft < viewportLeft) {
                setScrollX(scrollX - (viewportLeft - elementLeft))
            } else if (elementRightEdge > viewportWidth) {
                setScrollX(scrollX + (elementRightEdge - viewportWidth))
            }

            onItemFocus(focusPath)
        },
        [scrollX]
    )

    return (
        <Focusable focusKey="gallery">
            <div ref={viewportRef} style={{ width: "1078px" }}>
                <div
                    style={{
                        display: "flex",
                        transform: `translateX(-${scrollX}px)`,
                        transition: "transform 100ms ease-out",
                        willChange: "transform",
                    }}
                >
                    <div style={{ marginRight: "2px" }}>
                        <GameTile color="#1199EE" focusKey="1" onFocus={handleItemFocus} />
                    </div>
                    <div style={{ marginRight: "2px" }}>
                        <GameTile color="#FF88AA" focusKey="2" onFocus={handleItemFocus} />
                    </div>
                    <div style={{ marginRight: "2px" }}>
                        <GameTile color="#BB66CC" focusKey="3" onFocus={handleItemFocus} />
                    </div>
                    <div style={{ marginRight: "2px" }}>
                        <GameTile color="#FFCC66" focusKey="4" onFocus={handleItemFocus} />
                    </div>
                    <div style={{ marginRight: "2px" }}>
                        <GameTile color="#55CCFF" focusKey="5" onFocus={handleItemFocus} />
                    </div>
                    <GameTile color="#EE4444" focusKey="6" onFocus={handleItemFocus} />
                </div>
            </div>
        </Focusable>
    )
})

function GameTile({
    color,
    focusKey,
    onFocus,
}: {
    color: string
    focusKey: string
    onFocus: (args: { element: HTMLDivElement; focusPath: ReadonlyArray<string> }) => void
}) {
    const elementRef = useRef<HTMLDivElement>(null)
    const { focused, path } = useFocusable(focusKey, elementRef)

    const prevFocused = usePrevious(focused, focused)
    useEffect(() => {
        if (prevFocused !== focused && focused && onFocus) onFocus({ element: elementRef.current, focusPath: path })
    }, [prevFocused, focused, onFocus])

    return (
        <div
            style={{
                border: focused ? "4px solid cyan" : "4px solid transparent",
                borderRadius: "2px",
                transition: "border-color 100ms ease-out",
            }}
        >
            <div
                ref={elementRef}
                style={{
                    height: "260px",
                    width: "260px",
                    backgroundColor: color,
                    boxSizing: "border-box",
                    border: "2px solid black",
                    borderRadius: "2px",
                }}
            />
        </div>
    )
}
