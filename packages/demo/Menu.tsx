import * as React from "react"
import { Focusable } from "react-sunbeam"

import { Box } from "./Box"
import { times } from "./times"

interface Props {
    size: number
    onItemFocus?: (itemPath: ReadonlyArray<string>) => void
}

export const Menu = React.memo(function Menu({ size, onItemFocus }: Props) {
    return (
        <nav>
            {times(size, i => {
                const focusKey = `menuItem${i}`

                return (
                    <Focusable key={i} focusKey={focusKey} style={{ margin: "10px" }}>
                        {({ focused, path }) => (
                            <Box
                                focused={focused}
                                onFocus={() => {
                                    if (onItemFocus) onItemFocus(path)
                                }}
                                color="deepskyblue"
                                path={path}
                            >
                                Menu item {i}
                            </Box>
                        )}
                    </Focusable>
                )
            })}
        </nav>
    )
})
