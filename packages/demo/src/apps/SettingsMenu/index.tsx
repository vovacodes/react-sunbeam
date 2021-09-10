import * as React from "react"
import { useState } from "react"
import { useHistory } from "react-router-dom"
import { Focusable } from "react-sunbeam"
import { Hint } from "../../components/Hint.js"
import { Picker, PickerOption } from "./Picker.js"
import { Slider } from "./Slider.js"
import { Header } from "../../components/Header.js"
import { isCancel } from "../../keyPressUtils.js"

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
    const [brightness, setBrightness] = useState<number>(0.5)

    return (
        <>
            <Header />
            <Focusable
                onKeyDown={(event) => {
                    if (isCancel(event)) {
                        event.stopPropagation()
                        history.goBack()
                    }
                }}
                style={{
                    padding: "100px 60px",
                }}
            >
                <Picker label="Display mode" onPick={(value) => setDisplayMode(value)}>
                    {displayModes.map(({ label, value }) => (
                        <PickerOption key={value} label={label} value={value} selected={value === displayMode} />
                    ))}
                </Picker>
                <Picker label="Screen resolution" onPick={(value) => setResolution(value)}>
                    {resolutions.map(({ label, value }) => (
                        <PickerOption key={value} label={label} value={value} selected={value === resolution} />
                    ))}
                </Picker>
                <Slider
                    label="Brightness"
                    value={brightness}
                    minValue={0}
                    maxValue={1}
                    step={0.05}
                    onChange={(value) => setBrightness(value)}
                />
            </Focusable>
            <Hint>
                <div>
                    Navigation - <b>{"↑"}</b> and <b>{"↓"}</b>
                </div>
                <div>
                    Expand/Select - <b>Enter</b> or <b>Space</b>
                </div>
                <div>
                    Collapse/Go back - <b>Esc</b> or <b>Backspace</b>
                </div>
            </Hint>
        </>
    )
}
