import * as React from "react"
import { useCallback, useEffect, useMemo, useRef } from "react"
import { FOCUSABLE_TREE_ROOT_KEY } from "../../Constants"
import { FocusableTreeContext } from "../../FocusableTreeContext"
import { SunbeamContext } from "../../SunbeamContext"
import { FocusableNodesMap } from "../../types"
import registerFocusableIn from "../../registerFocusableIn"
import unregisterFocusableIn from "../../unregisterFocusableIn"
import { FocusManager } from "../../FocusManager"
import { BoundingBox } from "../../../spatialNavigation"
import getPreferredNodeAmong from "../../getPreferredNodeAmong"
import useFocusPath from "./useFocusPath"

interface Props {
    focusManager: FocusManager
    children: React.ReactNode
}

export function SunbeamProvider({ focusManager, children }: Props) {
    const focusPath = useFocusPath(focusManager)
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
    const getPreferredChild = useCallback(getPreferredNodeAmong(focusableChildrenRef.current), [])
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

    const focusableTreeContextValue = useMemo(
        () => ({
            focusPath,
            onFocusableUnmount: (focusableNodePath: ReadonlyArray<string>) => {
                const focusPath = focusManager.getFocusPath()
                const isNodeFocused = pathStartsWith(focusPath, focusableNodePath)
                if (isNodeFocused) {
                    focusManager.revalidateFocusPath()
                }
            },
            parentPath: path,
            parentFocusableNode: focusableTreeRoot,
            registerFocusable: registerFocusableIn(focusableChildrenRef.current),
            unregisterFocusable: unregisterFocusableIn(focusableChildrenRef.current),
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

function pathStartsWith(path: ReadonlyArray<string>, segment: ReadonlyArray<string>): boolean {
    if (path.length === 0 && segment.length === 0) return true

    for (let i = 0; i < segment.length; i++) {
        if (path[i] !== segment[i]) return false
    }

    return true
}
