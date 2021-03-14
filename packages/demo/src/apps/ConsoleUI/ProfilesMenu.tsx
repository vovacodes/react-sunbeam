import * as React from "react"
import { memo } from "react"
import { Focusable, FocusEvent } from "react-sunbeam"
import { FocusableItem } from "./FocusableItem.js"
import { Colors } from "../../styles.js"

type Props = {
    onFocus: (event: FocusEvent) => void
    onBlur: (event: FocusEvent) => void
    onItemFocus: (event: FocusEvent) => void
    onItemBlur: (event: FocusEvent) => void
}

export const ProfilesMenu = memo(function ProfilesMenu({ onFocus, onBlur, onItemFocus, onItemBlur }: Props) {
    return (
        <Focusable
            focusKey="profiles"
            onFocus={onFocus}
            onBlur={onBlur}
            style={{ display: "flex", justifyContent: "space-between" }}
        >
            <div style={{ display: "flex" }}>
                <div style={{ marginRight: "20px" }}>
                    <FocusableItem
                        kind="circle"
                        width={60}
                        height={60}
                        color={Colors.paleCyan}
                        focusKey="1"
                        onFocus={onItemFocus}
                        onBlur={onItemBlur}
                    />
                </div>
                <div style={{ marginRight: "20px" }}>
                    <FocusableItem
                        kind="circle"
                        width={60}
                        height={60}
                        color={Colors.paleGreen}
                        focusKey="2"
                        onFocus={onItemFocus}
                        onBlur={onItemBlur}
                    />
                </div>
                <div style={{ marginRight: "20px" }}>
                    <FocusableItem
                        kind="circle"
                        width={60}
                        height={60}
                        color={Colors.palePink}
                        focusKey="3"
                        onFocus={onItemFocus}
                        onBlur={onItemBlur}
                    />
                </div>
            </div>

            <FocusableItem
                kind="circle"
                width={60}
                height={60}
                color={Colors.sunRed}
                focusKey="4"
                onFocus={onItemFocus}
                onBlur={onItemBlur}
            />
        </Focusable>
    )
})
