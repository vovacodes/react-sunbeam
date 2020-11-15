import * as React from "react"
import { useMemo, useRef, useCallback, useEffect } from "react"
import { FocusableTreeContext } from "../FocusableTreeContext.js"
import type { BoundingBox, Direction } from "../../spatialNavigation/index.js"
import { KeyPressListener, KeyPressTreeContextProvider } from "../../keyPressManagement/index.js"
import type { FocusableNodesMap, FocusableTreeNode, FocusEvent } from "../types.js"
import { useGeneratedFocusKey } from "../hooks/useGeneratedFocusKey.js"
import { useOnFocusedChange } from "../hooks/useOnFocusedChange.js"
import { useKeyPressTreeNode } from "../hooks/useKeyPressTreeNode.js"
import getPreferredNode from "../getPreferredNode.js"

interface Props {
    focusKey?: string
    children: React.ReactNode | ((param: { focused: boolean; path: readonly string[] }) => React.ReactNode)
    focusable?: boolean
    lock?: Direction | Direction[]
    style?: React.CSSProperties
    className?: string
    onKeyPress?: KeyPressListener
    onFocus?: (event: FocusEvent) => void
    onBlur?: (event: FocusEvent) => void
    getPreferredChildOnFocus?: (args: {
        focusableChildren: FocusableNodesMap
        focusOrigin?: FocusableTreeNode
        direction?: Direction
    }) => FocusableTreeNode | undefined
}

export function Focusable({
    children,
    className,
    style,
    focusKey,
    focusable = true,
    lock = [],
    getPreferredChildOnFocus,
    onKeyPress,
    onFocus,
    onBlur,
}: Props) {
    const generatedFocusKey = useGeneratedFocusKey()
    const realFocusKey = focusKey || generatedFocusKey
    const lockDirections = Array.isArray(lock) ? lock : [lock]

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
            return getPreferredChildOnFocus
                ? getPreferredChildOnFocus({
                      focusableChildren: focusableChildrenRef.current,
                      focusOrigin,
                      direction,
                  })
                : getPreferredNode({ nodes: focusableChildrenRef.current, focusOrigin, direction })
        },
        [getPreferredChildOnFocus]
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
    const focusableTreeNode = useMemo<FocusableTreeNode>(
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

    const [focusedSiblingFocusKey, ...restOfFocusPath] = focusPath
    const focused = focusedSiblingFocusKey === realFocusKey
    const childrenFocusPath = focused ? restOfFocusPath : []

    useOnFocusedChange(focused, (isFocused) => {
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
    const childKeyPressTreeContextValue = useKeyPressTreeNode({ onKeyPress, focused })
    const renderCallbackArgument = useMemo(() => ({ focused: focused, path }), [focused, path])

    return (
        <FocusableTreeContext.Provider value={childFocusableTreeContextValue}>
            <KeyPressTreeContextProvider value={childKeyPressTreeContextValue}>
                <div ref={wrapperRef} className={className} style={style}>
                    {typeof children === "function" ? children(renderCallbackArgument) : children}
                </div>
            </KeyPressTreeContextProvider>
        </FocusableTreeContext.Provider>
    )
}
