import * as React from "react"
import { useMemo, useRef, useCallback, useEffect } from "react"
import { FocusableTreeContext } from "../FocusableTreeContext"
import { BoundingBox, Direction } from "../../spatialNavigation"
import { FocusableNodesMap, FocusableTreeNode, FocusEvent } from "../types"
import { useGeneratedFocusKey } from "../hooks/useGeneratedFocusKey"
import { useOnFocusedChange } from "../hooks/useOnFocusedChange"
import getPreferredNode from "../getPreferredNode"

interface Props {
    focusKey?: string
    children: React.ReactNode | ((param: { focused: boolean; path: readonly string[] }) => React.ReactNode)
    style?: React.CSSProperties
    className?: string
    unstable_getPreferredChildOnFocusReceive?: (args: {
        focusableChildren: FocusableNodesMap
        focusOrigin?: FocusableTreeNode
        direction?: Direction
    }) => FocusableTreeNode | undefined
    onFocus?: (event: FocusEvent) => void
    onBlur?: (event: FocusEvent) => void
}

/* eslint-disable @typescript-eslint/camelcase */
export function Focusable({
    children,
    className,
    style,
    focusKey,
    unstable_getPreferredChildOnFocusReceive,
    onFocus,
    onBlur,
}: Props) {
    const generatedFocusKey = useGeneratedFocusKey()
    const realFocusKey = focusKey || generatedFocusKey

    const wrapperRef = useRef<HTMLDivElement | null>(null)
    const focusableChildrenRef = useRef<FocusableNodesMap>(new Map())
    const getBoundingBox = React.useCallback((): BoundingBox => {
        const wrapperElement = wrapperRef.current
        if (!wrapperElement) {
            throw new Error(
                `Attempting to get a bounding box of a not mounted Focusable with focusKey: ${realFocusKey}`
            )
        }

        const { left, top, right, bottom } = wrapperElement.getBoundingClientRect()
        return { left, top, right, bottom }
    }, [realFocusKey])
    const getChildren = useCallback(() => focusableChildrenRef.current, [])
    const getPreferredChild = useCallback(
        (focusOrigin?: FocusableTreeNode, direction?: Direction) => {
            return unstable_getPreferredChildOnFocusReceive
                ? unstable_getPreferredChildOnFocusReceive({
                      focusableChildren: focusableChildrenRef.current,
                      focusOrigin,
                      direction,
                  })
                : getPreferredNode({ nodes: focusableChildrenRef.current, focusOrigin, direction })
        },
        [unstable_getPreferredChildOnFocusReceive]
    )
    const {
        addFocusableToMap,
        removeFocusableFromMap,
        focusPath,
        parentPath,
        parentFocusableNode,
        registerFocusable,
        unregisterFocusable,
        dispatchOnFocus,
        dispatchOnBlur,
    } = React.useContext(FocusableTreeContext)
    const path = useMemo(() => [...parentPath, realFocusKey], [parentPath, realFocusKey])
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

    const [focusedSiblingFocusKey, ...restOfFocusPath] = focusPath
    const focused = focusedSiblingFocusKey === realFocusKey
    const childrenFocusPath = focused ? restOfFocusPath : []

    useOnFocusedChange(focused, isFocused => {
        const element = wrapperRef.current
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

    const childFocusableTreeContextValue = useMemo(() => {
        return {
            addFocusableToMap,
            removeFocusableFromMap,
            focusPath: childrenFocusPath,
            parentPath: path,
            parentFocusableNode: focusableTreeNode,
            registerFocusable: (focusableTreeNode: FocusableTreeNode) => {
                addFocusableToMap(focusableChildrenRef.current, focusableTreeNode)
            },
            unregisterFocusable: (focusKey: string) => {
                removeFocusableFromMap(focusableChildrenRef.current, focusKey)
            },
            dispatchOnFocus,
            dispatchOnBlur,
        }
    }, [childrenFocusPath.join(), focusableTreeNode, path])

    const renderCallbackArgument = useMemo(() => ({ focused: focused, path }), [focused, path])

    return (
        <FocusableTreeContext.Provider value={childFocusableTreeContextValue}>
            <div ref={wrapperRef} className={className} style={style}>
                {typeof children === "function" ? children(renderCallbackArgument) : children}
            </div>
        </FocusableTreeContext.Provider>
    )
}
