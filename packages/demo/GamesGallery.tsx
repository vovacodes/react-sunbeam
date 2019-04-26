import * as React from "react"
import { memo, useCallback, useRef, useState, useEffect } from "react"
import { Focusable, useSunbeam } from "react-sunbeam"
import { FocusableItem, FocusEvent } from "./FocusableItem"

type Props = {
    onItemFocus: (event: FocusEvent) => void
}

export const GamesGallery = memo(function GamesGallery({ onItemFocus }: Props) {
    const viewportRef = useRef<HTMLDivElement>(null)
    const [scrollX, setScrollX] = useState<number>(0)
    const handleItemFocus = useCallback(
        (event: { focusPath: ReadonlyArray<string>; element: HTMLDivElement }) => {
            const viewport = viewportRef.current
            const { width: viewportWidth, left: viewportLeft } = viewport.getBoundingClientRect()

            const { left: elementLeft, width: elementWidth } = event.element.getBoundingClientRect()
            const elementOffsetLeft = elementLeft - viewportLeft
            const elementRightEdge = elementOffsetLeft + elementWidth

            if (elementLeft < viewportLeft) {
                setScrollX(scrollX - (viewportLeft - elementLeft))
            } else if (elementRightEdge > viewportWidth) {
                setScrollX(scrollX + (elementRightEdge - viewportWidth))
            }

            onItemFocus(event)
        },
        [scrollX]
    )
    const { setFocus } = useSunbeam()
    const handleItemClick = useCallback((itemFocusPath: ReadonlyArray<string>) => {
        setFocus(itemFocusPath)
    }, [])

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
                        <GameTile color="#1199EE" focusKey="1" onClick={handleItemClick} onFocus={handleItemFocus} />
                    </div>
                    <div style={{ marginRight: "2px" }}>
                        <GameTile color="#FF88AA" focusKey="2" onClick={handleItemClick} onFocus={handleItemFocus} />
                    </div>
                    <div style={{ marginRight: "2px" }}>
                        <GameTile color="#BB66CC" focusKey="3" onClick={handleItemClick} onFocus={handleItemFocus} />
                    </div>
                    <div style={{ marginRight: "2px" }}>
                        <GameTile color="#FFCC66" focusKey="4" onClick={handleItemClick} onFocus={handleItemFocus} />
                    </div>
                    <div style={{ marginRight: "2px" }}>
                        <GameTile color="#55CCFF" focusKey="5" onClick={handleItemClick} onFocus={handleItemFocus} />
                    </div>
                    <GameTile color="#EE4444" focusKey="6" onClick={handleItemClick} onFocus={handleItemFocus} />
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
    onClick: (focusPath: ReadonlyArray<string>) => void
    onFocus: (event: FocusEvent) => void
}) {
    return (
        <FocusableItem
            focusKey={focusKey}
            style={focused => ({
                border: focused ? "4px solid cyan" : "4px solid transparent",
                borderRadius: "2px",
                transition: "border-color 100ms ease-out",
            })}
            onFocus={onFocus}
        >
            <div
                style={{
                    height: "260px",
                    width: "260px",
                    backgroundColor: color,
                    boxSizing: "border-box",
                    border: "2px solid black",
                    borderRadius: "2px",
                }}
            />
        </FocusableItem>
    )
}
