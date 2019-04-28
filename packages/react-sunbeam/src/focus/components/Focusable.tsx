import * as React from "react"
import { useMemo, useRef, useCallback, useEffect } from "react"
import { FocusableTreeContext } from "../FocusableTreeContext"
import { BoundingBox } from "../../spatialNavigation"
import { FocusableNodesMap, FocusableTreeNode } from "../types"
import registerFocusableIn from "../registerFocusableIn"
import unregisterFocusableIn from "../unregisterFocusableIn"
import getPreferredNodeAmong from "../getPreferredNodeAmong"

interface Props {
    focusKey: string
    children: React.ReactNode | ((param: { focused: boolean; path: ReadonlyArray<string> }) => React.ReactNode)
    style?: React.CSSProperties
    className?: string
}

export function Focusable(props: Props) {
    const { focusKey } = props
    const wrapperRef = useRef<HTMLDivElement | null>(null)
    const focusableChildrenRef = useRef<FocusableNodesMap>(new Map())
    const getBoundingBox = React.useCallback((): BoundingBox => {
        const wrapperElement = wrapperRef.current
        if (!wrapperElement) {
            throw new Error(`Attempting to get a bounding box of a not mounted Focusable with focusKey: ${focusKey}`)
        }

        const { left, top, right, bottom } = wrapperElement.getBoundingClientRect()
        return { left, top, right, bottom }
    }, [focusKey])
    const getChildren = useCallback(() => focusableChildrenRef.current, [])
    const getPreferredChild = useCallback(getPreferredNodeAmong(focusableChildrenRef.current), [])
    const { parentPath, focusPath, parentFocusableNode, registerFocusable, unregisterFocusable } = React.useContext(
        FocusableTreeContext
    )
    const path = useMemo(() => [...parentPath, focusKey], [parentPath, focusKey])
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

    const [focusedSiblingFocusKey, ...restOfFocusPath] = focusPath
    const isFocused = focusedSiblingFocusKey === focusKey
    const childrenFocusPath = isFocused ? restOfFocusPath : []

    const childFocusableTreeContextValue = useMemo(() => {
        return {
            focusPath: childrenFocusPath,
            parentPath: path,
            parentFocusableNode: focusableTreeNode,
            registerFocusable: registerFocusableIn(focusableChildrenRef.current),
            unregisterFocusable: unregisterFocusableIn(focusableChildrenRef.current),
        }
    }, [childrenFocusPath.join(), focusableTreeNode, path])

    const renderCallbackArgument = useMemo(() => ({ focused: isFocused, path }), [isFocused, path])

    return (
        <FocusableTreeContext.Provider value={childFocusableTreeContextValue}>
            <div ref={wrapperRef} className={props.className} style={props.style}>
                {typeof props.children === "function" ? props.children(renderCallbackArgument) : props.children}
            </div>
        </FocusableTreeContext.Provider>
    )
}
