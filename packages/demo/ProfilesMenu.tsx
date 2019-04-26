import * as React from "react"
import { memo } from "react"
import { Focusable } from "react-sunbeam"
import { FocusableItem, FocusEvent } from "./FocusableItem"

type Props = {
    onItemFocus: (event: FocusEvent) => void
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
    onFocus: (event: FocusEvent) => void
}) {
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
                    backgroundColor: color,
                    border: "2px solid black",
                    borderRadius: "50%",
                    boxSizing: "border-box",
                    height: "64px",
                    width: "64px",
                }}
            />
        </FocusableItem>
    )
}
