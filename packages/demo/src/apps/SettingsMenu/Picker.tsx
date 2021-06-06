import * as React from "react"
import { ReactComponentElement, useEffect, useRef, useState } from "react"
import { motion } from "framer-motion"
import { Direction, Focusable, useFocusable, useFocusManager } from "react-sunbeam"
import { Colors, Typography } from "../../styles.js"
import { isCancel, isSelect } from "../../keyPressUtils.js"

export function Picker({
    label,
    children,
    onPick,
}: {
    label: string
    children: ReactComponentElement<typeof PickerOption>[]
    onPick: (value: string) => void
}) {
    const [open, setOpen] = useState(false)

    const clonedChildren = React.Children.map(children, (option) => {
        return React.cloneElement(option, {
            focusable: open,
            onPick: (value: string) => {
                onPick(value)
                setOpen(false)
            },
            focusKey: option.props.focusKey ?? `PickerOption:${option.props.value}`,
        })
    })
    const clonedChildrenArray = React.Children.toArray(clonedChildren) as ReactComponentElement<typeof PickerOption>[]
    const selectedOption = clonedChildrenArray.find((option) => option.props.selected)!

    // focus on the "selected" option when opened
    const focusKeyByValue = clonedChildrenArray.reduce((result, option) => {
        result[option.props.value] = option.props.focusKey!
        return result
    }, {} as Record<string, string>)

    return (
        <Focusable
            lock={open ? [Direction.UP, Direction.DOWN] : undefined}
            onKeyDown={(event) => {
                if (isSelect(event)) {
                    event.stopPropagation()
                    setOpen(true)
                }
                if (isCancel(event) && open) {
                    event.stopPropagation()
                    setOpen(false)
                }
            }}
        >
            {({ focused, path }) => {
                // This callback is called during rendering and it never changes so we can safely call hooks inside of it.
                /* eslint-disable react-hooks/rules-of-hooks */
                const focusManager = useFocusManager()
                const prevOpen = usePrevious(open, open)
                useEffect(() => {
                    if (!open || prevOpen === open) return

                    focusManager.setFocus(path.concat(focusKeyByValue[selectedOption.props.value]))
                })
                /* eslint-enable react-hooks/rules-of-hooks */

                return (
                    <div
                        style={{
                            position: "relative",
                            display: "flex",
                            justifyContent: "space-between",
                            padding: "10px",
                            marginBottom: "8px",
                            maxWidth: "450px",
                            ...Typography.bodyText,
                        }}
                    >
                        {/* Border */}
                        <motion.div
                            animate={{ opacity: focused ? 1 : 0 }}
                            transition={{ ease: "easeOut", duration: 0.15 }}
                            style={{
                                position: "absolute",
                                top: -2,
                                left: -2,
                                width: "100%",
                                height: "100%",
                                border: `2px solid ${Colors.textBlack}`,
                                zIndex: -1,
                            }}
                        />
                        {/* Background */}
                        <div
                            style={{
                                position: "absolute",
                                top: -2,
                                left: -2,
                                width: "calc(100% + 4px)",
                                height: "calc(100% + 4px)",
                                background: Colors.background,
                                zIndex: -2,
                            }}
                        />
                        {/* Shadow */}
                        <motion.div
                            animate={{
                                x: focused ? 0 : -4,
                                y: focused ? 0 : -4,
                                opacity: focused ? 1 : 0,
                            }}
                            transition={{ ease: "easeOut", duration: 0.15 }}
                            style={{
                                position: "absolute",
                                top: 0,
                                left: 0,
                                width: "100%",
                                height: "100%",
                                boxShadow: `6px 6px 0px 0px ${Colors.textBlack}`,
                                zIndex: -3,
                            }}
                        />
                        <div>{label}</div>
                        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
                            {open ? clonedChildren : selectedOption}
                        </div>
                    </div>
                )
            }}
        </Focusable>
    )
}

export function PickerOption({
    label,
    value,
    focusKey,
    focusable,
    onPick,
}: {
    label: string
    value: string
    selected?: boolean
    // If not present, provided by Picker
    focusKey?: string
    // Always provided by Picker
    focusable?: boolean
    // Always provided by Picker
    onPick?: (value: string) => void
}) {
    const ref = useRef(null)
    const { focused } = useFocusable({
        focusable,
        elementRef: ref,
        focusKey,
        onKeyDown(event) {
            if (isSelect(event)) {
                event.stopPropagation()
                if (onPick) onPick(value)
            }
        },
    })

    return (
        <div ref={ref} style={{ fontWeight: focused ? 700 : 500 }}>
            {label}
        </div>
    )
}

function usePrevious<T>(value: T, initialValue: T): T {
    const ref = useRef<T>(initialValue)

    // Store current value in ref
    useEffect(() => {
        ref.current = value
    }, [value])

    // Return previous value (happens before update in useEffect above)
    return ref.current
}
