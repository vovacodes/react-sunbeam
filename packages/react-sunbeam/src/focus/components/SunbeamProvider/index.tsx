import * as React from "react"
import { useCallback, useEffect, useMemo, useRef } from "react"
import { FOCUSABLE_TREE_ROOT_KEY } from "../../Constants"
import { FocusableTreeContext, FocusableTreeContextValue } from "../../FocusableTreeContext"
import { SunbeamContext } from "../../SunbeamContext"
import { FocusableNodesMap, FocusableTreeNode, FocusPath } from "../../types"
import { FocusManager } from "../../FocusManager"
import {
    KeyPressManager,
    KeyPressListener,
    KeyPressTreeContextProvider,
    KeyPressTreeNode,
} from "../../../keyPressManagement"
import { BoundingBox, Direction } from "../../../spatialNavigation"
import getPreferredNode from "../../getPreferredNode"
import { useChildKeyPressTreeContextValue } from "../../hooks/useChildKeyPressTreeContextValue"
import useFocusPath from "./useFocusPath"

type Props = {
    focusManager: FocusManager
    keyPressManager?: KeyPressManager
    children: React.ReactNode
    onFocusUpdate?: (event: { focusPath: FocusPath }) => void
    onKeyPress?: KeyPressListener
    getPreferredChildOnFocus?: (args: {
        focusableChildren: FocusableNodesMap
        focusOrigin?: FocusableTreeNode
        direction?: Direction
    }) => FocusableTreeNode | undefined
}

/* eslint-disable @typescript-eslint/camelcase */
export function SunbeamProvider({
    focusManager,
    keyPressManager: customKeyPressManager,
    children,
    onFocusUpdate,
    onKeyPress,
    getPreferredChildOnFocus,
}: Props) {
    const focusPath = useFocusPath(focusManager, onFocusUpdate)
    const wrapperRef = useRef<HTMLDivElement | null>(null)
    const getBoundingBox = useCallback((): BoundingBox => {
        const wrapperElement = wrapperRef.current

        if (!wrapperElement) {
            throw new Error("Attempting to get a bounding box of " + "the root Focusable when it is not mounted")
        }

        const boundingClientRect = wrapperElement.getBoundingClientRect()
        const { left, top, right, bottom } = boundingClientRect

        return { left, top, right, bottom }
    }, [])
    const focusableChildrenRef = useRef<FocusableNodesMap>(new Map())
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
    const path = useMemo(() => [], [])
    const focusableTreeRoot = useMemo(
        () => ({
            focusKey: FOCUSABLE_TREE_ROOT_KEY,
            getParent: () => undefined,
            getBoundingBox,
            getChildren,
            getPreferredChild,
            lock: [],
        }),
        [getChildren, getPreferredChild, getBoundingBox]
    )

    useEffect(() => {
        focusManager.setFocusableRoot(focusableTreeRoot)
        return () => {
            focusManager.clearFocusableRoot()
        }
    }, [focusManager, focusableTreeRoot])

    const revalidateFocus = useCallback(() => focusManager.revalidateFocusPath(), [focusManager])
    const debouncedRevalidateFocus = defer(revalidateFocus)
    function addFocusableToMap(focusableChildrenMap: FocusableNodesMap, focusableTreeNode: FocusableTreeNode) {
        const { focusKey } = focusableTreeNode
        if (focusableChildrenMap.has(focusKey)) {
            throw new Error(
                `can't register Focusable child with focusKey=${focusKey}. ` + `This key is already registered`
            )
        }
        focusableChildrenMap.set(focusKey, focusableTreeNode)
        debouncedRevalidateFocus()
    }
    function removeFocusableFromMap(focusableChildrenMap: FocusableNodesMap, focusKey: string) {
        if (!focusableChildrenMap.has(focusKey)) {
            throw new Error(
                `can't unregister Focusable child with focusKey=${focusKey}. There is no Focusable with such key registered`
            )
        }
        focusableChildrenMap.delete(focusKey)
        debouncedRevalidateFocus()
    }

    // ====================================
    // onFocus/onBlur scheduling
    //
    // all the dispatchOnFocus/dispatchOnBlur calls happen synchronously in the same macrotask
    // their order is defined by the order of useEffect() execution by React, which is child -> parent
    //
    // the code below will accumulate all the calls and fire the callbacks in the right order
    // at the end of the current macrotask:
    //
    // childOnBlur -> parentOnBlur -> parentOnFocus -> childOnFocus
    // ====================================
    const onFocusDispatchQueueRef = useRef<(() => void)[]>([])
    const onBlurDispatchQueueRef = useRef<(() => void)[]>([])
    const shouldExhaustEventQueuesRef = useRef<boolean>(true)
    const dispatchOnFocus = useCallback((onFocusHandler: () => void) => {
        onFocusDispatchQueueRef.current.push(onFocusHandler)
        scheduleEventQueuesProcessingIfNeeded()
    }, [])
    const dispatchOnBlur = useCallback((onBlurHandler: () => void) => {
        onBlurDispatchQueueRef.current.push(onBlurHandler)
        scheduleEventQueuesProcessingIfNeeded()
    }, [])
    function scheduleEventQueuesProcessingIfNeeded() {
        // make sure the queues are processed only once during the same macrotask
        if (!shouldExhaustEventQueuesRef.current) return
        shouldExhaustEventQueuesRef.current = false

        // schedule as microtask at the end of the current macrotask
        Promise.resolve().then(() => {
            // 1. first process onBlur in FIFO order (child -> parent)
            let onBlur = onBlurDispatchQueueRef.current.shift()
            while (onBlur) {
                try {
                    onBlur()
                } catch (err) {
                    console.error("There was an error in onBlur handler", err)
                }
                onBlur = onBlurDispatchQueueRef.current.shift()
            }

            // 2. then onFocus in FILO order (parent -> child)
            let onFocus = onFocusDispatchQueueRef.current.pop()
            while (onFocus) {
                try {
                    onFocus()
                } catch (err) {
                    console.error("There was an error in onFocus handler", err)
                }
                onFocus = onFocusDispatchQueueRef.current.pop()
            }
            shouldExhaustEventQueuesRef.current = true
        })
    }

    // ====================================
    // Key press management
    // ====================================
    const childKeyPressTreeNodeRef = useRef<KeyPressTreeNode | undefined>(undefined)
    const keyPressManager = useMemo<KeyPressManager>(() => {
        if (customKeyPressManager != null) return customKeyPressManager
        return new KeyPressManager()
    }, [customKeyPressManager])
    useEffect(() => {
        keyPressManager.addListener(keyPressListener)
        function keyPressListener(event: KeyboardEvent) {
            // first build up the array of listeners from the root to the leaf
            const listeners: KeyPressListener[] = onKeyPress ? [onKeyPress] : []
            let keyPressTreeNode: KeyPressTreeNode | undefined = childKeyPressTreeNodeRef.current
            while (keyPressTreeNode) {
                const listener = keyPressTreeNode.listenerRef.current
                if (listener) listeners.push(listener)
                keyPressTreeNode = keyPressTreeNode.childKeyPressTreeNodeRef.current
            }
            // then process this array from the leaf to the root
            for (let i = listeners.length - 1; i >= 0; i--) {
                const listener = listeners[i]
                listener(event)
                if (event.cancelBubble) break
            }
        }

        return () => {
            keyPressManager.removeListener(keyPressListener)
        }
    }, [onKeyPress, keyPressManager])
    const childKeyPressTreeContextValue = useChildKeyPressTreeContextValue(childKeyPressTreeNodeRef)

    const focusableTreeContextValue = useMemo<FocusableTreeContextValue>(
        () => ({
            addFocusableToMap,
            removeFocusableFromMap,
            focusPath,
            parentPath: path,
            parentFocusableNode: focusableTreeRoot,
            registerFocusable: (focusableTreeNode: FocusableTreeNode) => {
                addFocusableToMap(focusableChildrenRef.current, focusableTreeNode)
            },
            unregisterFocusable: (focusKey: string) => {
                removeFocusableFromMap(focusableChildrenRef.current, focusKey)
            },
            dispatchOnFocus,
            dispatchOnBlur,
        }),
        [focusPath.join(), focusableTreeRoot, path]
    )

    const sunbeamContextValue = useMemo(
        () => ({
            moveFocusLeft: () => focusManager.moveLeft(),
            moveFocusRight: () => focusManager.moveRight(),
            moveFocusUp: () => focusManager.moveUp(),
            moveFocusDown: () => focusManager.moveDown(),
            setFocus: focusManager.setFocus.bind(focusManager),
        }),
        [focusManager]
    )

    return (
        <SunbeamContext.Provider value={sunbeamContextValue}>
            <FocusableTreeContext.Provider value={focusableTreeContextValue}>
                <KeyPressTreeContextProvider value={childKeyPressTreeContextValue}>
                    <div ref={wrapperRef}>{children}</div>
                </KeyPressTreeContextProvider>
            </FocusableTreeContext.Provider>
        </SunbeamContext.Provider>
    )
}

function defer(fn: () => void): () => void {
    let promise: Promise<void> | null

    return function deferred() {
        if (promise) return

        promise = Promise.resolve().then(() => {
            fn()
            promise = null
        })
    }
}
