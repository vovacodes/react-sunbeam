import * as React from "react"
import { memo, useCallback } from "react"
import { FocusableCircle } from "./FocusableCircle"

const Animals = [
    ["goat", "🐐"],
    ["sheep", "🐑"],
    ["chicken", "🐓"],
    ["kangaroo", "🦘"],
    ["crocodile", "🐊"],
    ["lobster", "🦞"],
    ["dog", "🐕"],
    ["octopus", "🐙"],
    ["penguin", "🐧"],
    ["unicorn", "🦄"],
]

type Props = {
    onItemFocus?: (itemPath: ReadonlyArray<string>) => void
}

export const ScrollableMenu = memo(function ScrollableMenu({ onItemFocus }: Props) {
    const handleFocus = useCallback(
        ({ focusPath, element }) => {
            element.scrollIntoView({ behavior: "smooth", block: "nearest" })
            if (onItemFocus) onItemFocus(focusPath)
        },
        [onItemFocus]
    )

    return (
        <div>
            {Animals.map(([name, emoji]) => (
                <FocusableCircle key={name} focusKey={name} onFocus={handleFocus}>
                    {emoji}
                </FocusableCircle>
            ))}
        </div>
    )
})
