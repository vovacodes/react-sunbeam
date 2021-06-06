import * as React from "react"
import { useState } from "react"
import { motion } from "framer-motion"
import { Direction, Focusable, SyntheticGamepadKeyEvent } from "react-sunbeam"
import { Colors, Typography } from "../../styles.js"
import { isCancel, isLeft, isRight, isSelect } from "../../keyPressUtils.js"

export function Slider({
    label,
    minValue,
    maxValue,
    step,
    value,
    onChange,
}: {
    label: string
    minValue: number
    maxValue: number
    step: number
    value: number
    onChange: (value: number) => void
}) {
    const [active, setActive] = useState(false)

    return (
        <Focusable
            lock={active ? [Direction.UP, Direction.DOWN] : undefined}
            onKeyDown={(event) => {
                if (isSelect(event)) {
                    event.stopPropagation()
                    setActive(true)
                }

                if (isCancel(event) && active) {
                    event.stopPropagation()
                    setActive(false)
                }
            }}
        >
            {({ focused }) => {
                return (
                    <div
                        style={{
                            position: "relative",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            padding: "10px",
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
                                left: 0,
                                width: "100%",
                                height: "100%",
                                boxShadow: `6px 6px 0px 0px ${Colors.textBlack}`,
                                zIndex: -3,
                            }}
                        />
                        <div>{label}</div>
                        <SliderControl
                            active={active}
                            minValue={minValue}
                            maxValue={maxValue}
                            step={step}
                            value={value}
                            onChange={(v) => {
                                setActive(false)
                                onChange(v)
                            }}
                        />
                    </div>
                )
            }}
        </Focusable>
    )
}

function SliderControl({
    active,
    minValue,
    maxValue,
    step,
    value,
    onChange,
}: {
    active: boolean
    minValue: number
    maxValue: number
    step: number
    value: number
    onChange: (value: number) => void
}) {
    const [transientValue, setTransientValue] = useState<number | null>(null)

    let currentValue = active ? transientValue ?? value : value
    currentValue = clamp(currentValue, minValue, maxValue)

    return (
        <Focusable
            focusable={active}
            style={{ position: "relative", height: "2px", width: "150px", background: Colors.lightGray }}
            onKeyDown={(event) => {
                if (isRight(event)) {
                    event.stopPropagation()
                    setTransientValue((current) => {
                        if (current == null) {
                            current = value
                        }

                        return clamp(current + step, minValue, maxValue)
                    })
                }

                if (isLeft(event)) {
                    event.stopPropagation()
                    setTransientValue((current) => {
                        if (current == null) {
                            current = value
                        }

                        return clamp(current - step, minValue, maxValue)
                    })
                }

                if (transientValue != null && isSelect(event)) {
                    event.stopPropagation()
                    onChange(transientValue)
                }
            }}
        >
            <div
                style={{
                    position: "absolute",
                    left: 0,
                    top: 0,
                    height: "2px",
                    width: `${150 * (currentValue / maxValue)}px`,
                    background: Colors.textBlack,
                }}
            />
            {/* Knob */}
            <div
                style={{
                    position: "absolute",
                    left: `${150 * (currentValue / maxValue) - 4}px`,
                    top: "-4px",
                    height: "10px",
                    width: "10px",
                    borderRadius: "50%",
                    background: Colors.textBlack,
                    willChange: "transform",
                    transform: `scale(${active ? 1.5 : 1})`,
                    transition: "transform 150ms ease-out",
                }}
            />
        </Focusable>
    )
}

function clamp(value: number, min: number, max: number): number {
    return Math.min(Math.max(min, value), max)
}
