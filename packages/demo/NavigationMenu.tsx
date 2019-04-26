import * as React from "react"
import { memo } from "react"
import { Focusable } from "react-sunbeam"
import { FocusEvent, FocusableItem } from "./FocusableItem"

type Props = {
    onItemFocus: (event: FocusEvent) => void
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

function NavMenuItem({ focusKey, onFocus }: { focusKey: string; onFocus: (event: FocusEvent) => void }) {
    return (
        <FocusableItem
            focusKey={focusKey}
            style={focused => ({
                border: focused ? "4px solid cyan" : "4px solid transparent",
                borderRadius: "50%",
                transition: "border-color 100ms ease-out",
            })}
            onFocus={onFocus}
        >
            <div
                style={{
                    backgroundColor: "#505050",
                    boxSizing: "border-box",
                    border: "2px solid black",
                    borderRadius: "50%",
                    height: "92px",
                    width: "92px",
                }}
            />
        </FocusableItem>
    )
}
