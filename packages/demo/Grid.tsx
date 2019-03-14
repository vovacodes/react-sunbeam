import * as React from "react"
import { Focusable } from "react-sunbeam"

import { Box } from "./Box"
import { times } from "./times"

interface Props {
    size: number
    onItemFocus?: (itemFocusKey: string) => void
}

export const Grid = React.memo(({ size, onItemFocus }: Props) => (
    <div style={{ display: "flex", flexWrap: "wrap" }}>
        {times(size, i => {
            const focusKey = `gridItem${i}`

            return (
                <Focusable key={i} focusKey={focusKey} style={{ margin: "10px" }}>
                    {focused => (
                        <Box
                            focused={focused}
                            onFocus={() => {
                                if (onItemFocus) onItemFocus(focusKey)
                            }}
                            color="salmon"
                        >
                            Grid item {i}
                        </Box>
                    )}
                </Focusable>
            )
        })}
    </div>
))
