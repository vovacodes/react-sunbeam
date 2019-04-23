import React, { MutableRefObject, useCallback, useMemo, useEffect } from "react"
import { FocusableTreeNode } from "../types"
import { BoundingBox } from "../../spatialNavigation"
import { FocusableTreeContext } from "../FocusableTreeContext"

// TODO: add other options: () => ClientRect | ClientRect
type Element = MutableRefObject<{
    getBoundingClientRect(): ClientRect
}>

export function useFocusable(focusKey: string, elementRef: Element): { focused: boolean; path: string[] } {
    const { parentPath, focusPath, parentFocusableNode, registerFocusable, unregisterFocusable } = React.useContext(
        FocusableTreeContext
    )
    const [focusedSiblingFocusKey] = focusPath
    const path = useMemo(() => [...parentPath, focusKey], [parentPath, focusKey])

    const getChildren = useCallback(() => new Map(), [])
    const getPreferredChild = useCallback(() => undefined, [])
    const getBoundingBox = React.useCallback((): BoundingBox => {
        const wrapperElement = elementRef.current
        if (!wrapperElement) {
            throw new Error(`Attempting to get a bounding box of a not mounted Focusable with focusKey: ${focusKey}`)
        }

        return wrapperElement.getBoundingClientRect()
    }, [focusKey])

    const focusableTreeNode: FocusableTreeNode = useMemo(
        () => ({
            focusKey,
            getParent: () => parentFocusableNode,
            getChildren,
            getPreferredChild,
            getBoundingBox,
        }),
        [focusKey, parentFocusableNode, getChildren, getPreferredChild, getBoundingBox]
    )

    useEffect(() => {
        registerFocusable(focusableTreeNode)

        return () => unregisterFocusable(focusKey)
    }, [focusableTreeNode, focusKey])

    return { focused: focusedSiblingFocusKey === focusKey, path }
}
