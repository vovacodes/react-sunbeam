import * as React from "react"
import { ComponentProps, ReactComponentElement, ReactElement, useEffect, useRef, useState } from "react"
import { useHistory } from "react-router-dom"
import { Focusable, useFocusable, useSunbeam } from "react-sunbeam"

const displayModes = [
    { label: "Fullscreen", value: "fullscreen" },
    { label: "Window", value: "window" },
]

const resolutions = [
    { label: "4K", value: "4k" },
    { label: "2K", value: "2k" },
    { label: "FullHD", value: "fullhd" },
    { label: "HD", value: "hd" },
]

export function SettingsMenu() {
    const history = useHistory()

    const [displayMode, setDisplayMode] = useState<string>("fullscreen")
    const [resolution, setResolution] = useState<string>("2k")

    return (
        <Focusable
            onKeyPress={event => {
                if (event.key !== "Backspace") return
                event.stopPropagation()
                history.goBack()
            }}
            style={{
                padding: "100px 60px",
            }}
        >
            <Picker label="Display mode" onPick={value => setDisplayMode(value)}>
                {displayModes.map(({ label, value }) => (
                    <PickerOption key={value} label={label} value={value} selected={value === displayMode} />
                ))}
            </Picker>
            <Picker label="Screen resolution" onPick={value => setResolution(value)}>
                {resolutions.map(({ label, value }) => (
                    <PickerOption key={value} label={label} value={value} selected={value === resolution} />
                ))}
            </Picker>
        </Focusable>
    )
}

function Picker({
    label,
    children,
    onPick,
}: {
    label: string
    children: ReactComponentElement<typeof PickerOption>[]
    onPick: (value: string) => void
}) {
    const [open, setOpen] = useState(false)

    const clonedChildren = React.Children.map(children, option => {
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
    const selectedOption = clonedChildrenArray.find(option => option.props.selected)!

    // focus on the "selected" option when opened
    const focusKeyByValue = clonedChildrenArray.reduce((result, option) => {
        result[option.props.value] = option.props.focusKey!
        return result
    }, {} as Record<string, string>)

    return (
        <Focusable
            onKeyPress={event => {
                if (event.key === "Enter") {
                    event.stopPropagation()
                    setOpen(true)
                }
                if ((event.key === "Backspace" || event.key === "Escape") && open) {
                    event.stopPropagation()
                    setOpen(false)
                }
            }}
        >
            {({ focused, path }) => {
                const { setFocus } = useSunbeam()
                const prevOpen = usePrevious(open, open)
                useEffect(() => {
                    if (!open || prevOpen === open) return

                    setFocus(path.concat(focusKeyByValue[selectedOption.props.value]))
                })

                return (
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                            padding: "10px",
                            borderBottom: focused ? "2px solid black" : "2px solid transparent",
                            maxWidth: "450px",
                            fontFamily: '"Fira Code", monospace',
                            fontSize: 16,
                        }}
                    >
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

function PickerOption({
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
        onKeyPress(event) {
            if (event.key === "Enter" && focusable) {
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
