import * as React from "react"
import { useCallback, useEffect, useMemo, useRef } from "react"
import { FOCUSABLE_TREE_ROOT_KEY } from "../../Constants"
import { FocusableTreeContext } from "../../FocusableTreeContext"
import { SunbeamContext } from "../../SunbeamContext"
import { FocusableNodesMap, FocusableTreeNode, FocusPath } from "../../types"
import { FocusManager } from "../../FocusManager"
import { BoundingBox, Direction } from "../../../spatialNavigation"
import getPreferredNode from "../../getPreferredNode"
import useFocusPath from "./useFocusPath"

interface Props {
    focusManager: FocusManager
    children: React.ReactNode
    // unstable_passFocusBetweenChildren?: (args: {
    //     focusableChildren: FocusableNodesMap
    //     focusOrigin: FocusableTreeNode
    //     direction: Direction
    // }) => FocusableTreeNode | "KEEP_FOCUS_UNCHANGED" | "CANDIDATE_NOT_FOUND"
    onFocusUpdate?: (event: { focusPath: FocusPath }) => void
    unstable_getPreferredChildOnFocusReceive?: (args: {
        focusableChildren: FocusableNodesMap
        focusOrigin?: FocusableTreeNode
        direction?: Direction
    }) => FocusableTreeNode | undefined
}

/* eslint-disable @typescript-eslint/camelcase */
export function SunbeamProvider({
    focusManager,
    children,
    onFocusUpdate,
    unstable_getPreferredChildOnFocusReceive,
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
    const path = useMemo(() => [], [])
    const focusableTreeRoot = useMemo(
        () => ({
            focusKey: FOCUSABLE_TREE_ROOT_KEY,
            getParent: () => undefined,
            getBoundingBox,
            getChildren,
            getPreferredChild,
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
    const debouncedRevalidateFocus = useDebounce(revalidateFocus)
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

    const focusableTreeContextValue = useMemo(
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
                <div ref={wrapperRef}>{children}</div>
            </FocusableTreeContext.Provider>
        </SunbeamContext.Provider>
    )
}

function useDebounce(fn: () => void, timeout: number = 0) {
    const timerIdRef = useRef<number | undefined>(undefined)

    const debouncedFn = useCallback(() => {
        clearTimeout(timerIdRef.current)
        timerIdRef.current = setTimeout(fn, timeout)
    }, [fn, timeout])

    useEffect(() => {
        return () => clearTimeout(timerIdRef.current)
    }, [timeout])

    return debouncedFn
}
