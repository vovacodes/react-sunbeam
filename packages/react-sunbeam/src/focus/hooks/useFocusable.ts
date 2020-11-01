import React, { RefObject, useCallback, useMemo, useEffect } from "react"
import type { FocusableTreeNode, FocusEvent } from "../types.js"
import type { BoundingBox, Direction } from "../../spatialNavigation/index.js"
import { FocusableTreeContext } from "../FocusableTreeContext.js"
import { useGeneratedFocusKey } from "./useGeneratedFocusKey.js"
import { useOnFocusedChange } from "./useOnFocusedChange.js"
import { useKeyPressTreeNode } from "./useKeyPressTreeNode.js"
import type { KeyPressListener } from "../../keyPressManagement/index.js"

// TODO: add other options: () => ClientRect | ClientRect
type Element = RefObject<{
    getBoundingClientRect(): ClientRect
}>

export function useFocusable({
    elementRef,
    focusKey,
    focusable = true,
    lock = [],
    onKeyPress,
    onFocus,
    onBlur,
}: {
    elementRef: Element
    focusKey?: string
    focusable?: boolean
    lock?: Direction | Direction[]
    onKeyPress?: KeyPressListener
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
    const lockDirections = Array.isArray(lock) ? lock : [lock]

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
            lock: lockDirections,
        }),
        [
            realFocusKey,
            parentFocusableNode,
            getChildren,
            getPreferredChild,
            getBoundingBox,
            JSON.stringify(lockDirections),
        ]
    )

    useEffect(() => {
        if (focusable) registerFocusable(focusableTreeNode)

        return () => {
            if (focusable) unregisterFocusable(realFocusKey)
        }
    }, [focusable, focusableTreeNode, realFocusKey])

    const focused = focusedSiblingFocusKey === realFocusKey

    useOnFocusedChange(focused, (isFocused) => {
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

    useKeyPressTreeNode({ onKeyPress, focused })

    return { focused, path }
}
