import * as React from "react"
import { useContext, useEffect, useRef, useMemo } from "react"
import { FocusableTreeContext, Focusable, FocusableTreeNode, useSunbeam, getPathToNode } from "../react-sunbeam"

type ContainerProps = {
    children: React.ReactNode
    focusKey: string
    style?: React.CSSProperties
}

export default function AutoFocusContainer({ children, focusKey, ...rest }: ContainerProps) {
    const realFocusKey = focusKey ? `#AutoFocus#${focusKey}` : undefined
    return (
        <Focusable focusKey={realFocusKey} {...rest}>
            <AutoFocusTrigger />
            {children}
        </Focusable>
    )
}

export function AutoFocusTrigger() {
    const sunbeam = useSunbeam()
    const { parentFocusableNode } = useContext(FocusableTreeContext)

    useEffect(() => {
        const children = parentFocusableNode.getChildren()
        if (children.size === 0) {
            return
        }
        const nextChild = parentFocusableNode.getPreferredChild()
        if (nextChild) {
            const targetFocusPath = getPathToNode(nextChild)
            if (sunbeam && sunbeam.setFocus && targetFocusPath) {
                sunbeam.setFocus(targetFocusPath)
            }
        }
    }, [])
    return null
}
