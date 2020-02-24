import * as React from "react"
import { useContext, useEffect, useRef, useMemo, useCallback, useLayoutEffect } from "react"
import {
    FocusableTreeContext,
    Focusable,
    FocusableTreeNode,
    useSunbeam,
    getPathToNode,
    Direction,
    FocusableNodesMap,
} from "../react-sunbeam"
import {
    ListDirection,
    getCurrentDirection,
    sortNodesForDirection,
    getFirstFocusableChild,
    childrenToArray,
} from "./customStrategy"

type ContainerProps = {
    children: React.ReactNode
    focusKey: string
    style?: React.CSSProperties
}

export default function AutoFocusContainer({ children, focusKey }: ContainerProps) {
    const sunbeam = useSunbeam()
    const realFocusKey = focusKey ? `#AutoFocus#${focusKey}` : undefined
    const focusableChildrenRef = useRef<FocusableNodesMap>(new Map())
    const preContext = React.useContext(FocusableTreeContext)
    const registerFocusable = useCallback(
        (node: FocusableTreeNode) => {
            focusableChildrenRef.current.set(node.focusKey, node)
            return preContext.registerFocusable(node)
        },
        [preContext.registerFocusable]
    )
    const unregisterFocusable = useCallback(
        (focusKey: string) => {
            focusableChildrenRef.current.delete(focusKey)
            return preContext.unregisterFocusable(focusKey)
        },
        [preContext.unregisterFocusable]
    )
    const newContext = useMemo(() => {
        const {
            addFocusableToMap,
            removeFocusableFromMap,
            focusPath,
            parentPath,
            parentFocusableNode,
            dispatchOnFocus,
            dispatchOnBlur,
        } = preContext
        return {
            addFocusableToMap,
            removeFocusableFromMap,
            focusPath,
            parentPath,
            parentFocusableNode,
            dispatchOnFocus,
            dispatchOnBlur,
            registerFocusable,
            unregisterFocusable,
        }
    }, [preContext, registerFocusable, unregisterFocusable])
    const setFocus = sunbeam && sunbeam.setFocus
    useEffect(() => {
        const listDirection = getCurrentDirection(preContext.parentFocusableNode)
        const direction = listDirection === ListDirection.VERTICAL ? Direction.UP : Direction.LEFT
        const sorted = sortNodesForDirection(childrenToArray(focusableChildrenRef.current), direction)
        const first = sorted.find(node => getFirstFocusableChild(node, direction))
        if (first && setFocus) {
            const path = getPathToNode(first)
            setFocus(path)
        }
    }, [preContext.parentFocusableNode, focusableChildrenRef.current, setFocus])

    return <FocusableTreeContext.Provider value={newContext}>{children}</FocusableTreeContext.Provider>
}
