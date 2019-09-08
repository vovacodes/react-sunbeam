import React, { RefObject, useCallback, useMemo, useEffect } from "react"
import { FocusableTreeNode, FocusEvent } from "../types"
import { BoundingBox } from "../../spatialNavigation"
import { FocusableTreeContext } from "../FocusableTreeContext"
import { useGeneratedFocusKey } from "./useGeneratedFocusKey"
import { useOnFocusedChange } from "./useOnFocusedChange"

// TODO: add other options: () => ClientRect | ClientRect
type Element = RefObject<{
    getBoundingClientRect(): ClientRect
}>

export function useFocusable({
    elementRef,
    focusKey,
    onFocus,
    onBlur,
}: {
    elementRef: Element
    focusKey?: string
    onFocus?: (event: FocusEvent) => void
    onBlur?: (event: FocusEvent) => void
}): { focused: boolean; path: string[] } {
    const {
        focusPath,
        parentPath,
        parentFocusableNode,
        registerFocusable,
        unregisterFocusable,
        dispatchOnFocus,
        dispatchOnBlur,
    } = React.useContext(FocusableTreeContext)
    const generatedFocusKey = useGeneratedFocusKey()
    const realFocusKey = focusKey || generatedFocusKey
    const [focusedSiblingFocusKey] = focusPath
    const path = useMemo(() => [...parentPath, realFocusKey], [parentPath, realFocusKey])

    const getChildren = useCallback(() => new Map(), [])
    const getPreferredChild = useCallback(() => undefined, [])
    const getBoundingBox = React.useCallback((): BoundingBox => {
        const wrapperElement = elementRef.current
        if (!wrapperElement) {
            throw new Error(
                `Attempting to get a bounding box of a not mounted Focusable with focusKey: ${realFocusKey}`
            )
        }

        return wrapperElement.getBoundingClientRect()
    }, [realFocusKey, elementRef])

    const focusableTreeNode: FocusableTreeNode = useMemo(
        () => ({
            focusKey: realFocusKey,
            getParent: () => parentFocusableNode,
            getChildren,
            getPreferredChild,
            getBoundingBox,
        }),
        [realFocusKey, parentFocusableNode, getChildren, getPreferredChild, getBoundingBox]
    )

    useEffect(() => {
        registerFocusable(focusableTreeNode)

        return () => {
            unregisterFocusable(realFocusKey)
        }
    }, [focusableTreeNode, realFocusKey])

    const focused = focusedSiblingFocusKey === realFocusKey

    useOnFocusedChange(focused, isFocused => {
        const element = elementRef.current
        if (!element) return
        if (isFocused && onFocus) {
            dispatchOnFocus(() => {
                onFocus({
                    getBoundingClientRect: () => element.getBoundingClientRect(),
                    focusablePath: path,
                })
            })
        } else if (onBlur) {
            dispatchOnBlur(() => {
                onBlur({
                    getBoundingClientRect: () => element.getBoundingClientRect(),
                    focusablePath: path,
                })
            })
        }
    })

    return { focused, path }
}
