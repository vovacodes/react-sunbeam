import * as React from "react"
import { memo, useCallback, useRef, useState } from "react"
import { Focusable, FocusEvent } from "react-sunbeam"
import { FocusableItem } from "./FocusableItem.js"
import { Colors } from "../../styles.js"

type Props = {
    onFocus: (event: FocusEvent) => void
    onBlur: (event: FocusEvent) => void
    onItemFocus: (event: FocusEvent) => void
    onItemBlur: (event: FocusEvent) => void
}

export const GamesGallery = memo(function GamesGallery({ onFocus, onBlur, onItemFocus, onItemBlur }: Props) {
    const viewportRef = useRef<HTMLDivElement>(null)
    const trackRef = useRef<HTMLDivElement>(null)
    const [scrollX, setScrollX] = useState<number>(0)
    const handleItemFocus = useCallback(
        (event: FocusEvent) => {
            const viewport = viewportRef.current
            if (!viewport) throw new Error("Unexpected, viewportRef.current is undefined")
            const { width: viewportWidth, left: viewportLeft } = viewport.getBoundingClientRect()

            const { left: elementLeft, width: elementWidth } = event.getBoundingClientRect()
            const elementOffsetLeft = elementLeft - viewportLeft
            const elementRightEdge = elementOffsetLeft + elementWidth

            let deltaScrollX = 0
            if (elementLeft < viewportLeft) {
                deltaScrollX = elementLeft - viewportLeft
            } else if (elementRightEdge > viewportWidth) {
                deltaScrollX = elementRightEdge - viewportWidth
            }

            const newScrollX = ensureScrollXWithinBounds(scrollX + deltaScrollX)
            function ensureScrollXWithinBounds(value: number): number {
                if (!trackRef.current) throw new Error("Unexpected, trackRef.current is undefined")
                const minScrollX = 0
                const maxScrollX = trackRef.current.scrollWidth - viewportWidth
                if (value < minScrollX) return minScrollX
                if (value > maxScrollX) return maxScrollX
                return value
            }
            if (newScrollX !== scrollX) setScrollX(newScrollX)

            onItemFocus(event)
        },
        [onItemFocus, scrollX]
    )

    return (
        <Focusable onFocus={onFocus} onBlur={onBlur} focusKey="gamesGallery">
            <div ref={viewportRef} style={{ width: "810px" }}>
                <div
                    ref={trackRef}
                    style={{
                        display: "flex",
                        transform: `translateX(${-scrollX}px)`,
                        transition: "transform 100ms ease-out",
                        willChange: "transform",
                    }}
                >
                    <div style={{ marginRight: "30px" }}>
                        <FocusableItem
                            kind="square"
                            width={180}
                            height={180}
                            color={Colors.sunRed}
                            focusKey="1"
                            onFocus={handleItemFocus}
                            onBlur={onItemBlur}
                        />
                    </div>
                    <div style={{ marginRight: "30px" }}>
                        <FocusableItem
                            kind="square"
                            width={180}
                            height={180}
                            color={Colors.paleBlue}
                            focusKey="2"
                            onFocus={handleItemFocus}
                            onBlur={onItemBlur}
                        />
                    </div>
                    <div style={{ marginRight: "30px" }}>
                        <FocusableItem
                            kind="square"
                            width={180}
                            height={180}
                            color={Colors.palePink}
                            focusKey="3"
                            onFocus={handleItemFocus}
                            onBlur={onItemBlur}
                        />
                    </div>
                    <div style={{ marginRight: "30px" }}>
                        <FocusableItem
                            kind="square"
                            width={180}
                            height={180}
                            color={Colors.paleGreen}
                            focusKey="4"
                            onFocus={handleItemFocus}
                            onBlur={onItemBlur}
                        />
                    </div>
                    <div style={{ marginRight: "30px" }}>
                        <FocusableItem
                            kind="square"
                            width={180}
                            height={180}
                            color={Colors.paleYellow}
                            focusKey="5"
                            onFocus={handleItemFocus}
                            onBlur={onItemBlur}
                        />
                    </div>
                    <div>
                        <FocusableItem
                            kind="square"
                            width={180}
                            height={180}
                            color={Colors.paleCyan}
                            focusKey="6"
                            onFocus={handleItemFocus}
                            onBlur={onItemBlur}
                        />
                    </div>
                </div>
            </div>
        </Focusable>
    )
})
