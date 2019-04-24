import * as React from "react"
import { Focusable } from "react-sunbeam"

import { Box } from "./Box"
import { times } from "./times"

interface Props {
    size: number
    onItemFocus?: (itemFocusPath: ReadonlyArray<string>) => void
}

export const Grid = React.memo(function Grid({ size, onItemFocus }: Props) {
    return (
        <div style={{ display: "flex", flexWrap: "wrap" }}>
            {times(size, i => {
                const focusKey = `gridItem${i}`

                return (
                    <Focusable key={i} focusKey={focusKey} style={{ margin: "10px" }}>
                        {({ focused, path }) => (
                            <Box
                                focused={focused}
                                onFocus={() => {
                                    if (onItemFocus) onItemFocus(path)
                                }}
                                color="salmon"
                                path={path}
                            >
                                Grid item {i}
                            </Box>
                        )}
                    </Focusable>
                )
            })}
        </div>
    )
})
