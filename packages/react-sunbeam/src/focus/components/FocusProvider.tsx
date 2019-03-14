import * as React from "react"
import { FOCUSABLE_TREE_ROOT_KEY } from "../Constants"
import FocusableTreeContext from "../FocusableTreeContext"
import { ChildrenMap } from "../types"
import registerFocusableIn from "../registerFocusableIn"
import unregisterFocusableIn from "../unregisterFocusableIn"
import { FocusManager } from "../FocusManager"
import { BoundingBox } from "../../spatialNavigation"
import useFocusPath from "../hooks/useFocusPath"
import getPreferredNodeAmong from "../getPreferredNodeAmong"

interface Props {
    focusManager: FocusManager
    children: React.ReactNode
}

export function FocusProvider({ focusManager, children }: Props) {
    const focusPath = useFocusPath(focusManager)

    const wrapperRef = React.useRef<HTMLDivElement | null>(null)
    const getBoundingBox = React.useCallback((): BoundingBox => {
        const wrapperElement = wrapperRef.current

        if (!wrapperElement) {
            throw new Error("Attempting to get a bounding box of " + "the root Focusable when it is not mounted")
        }

        const boundingClientRect = wrapperElement.getBoundingClientRect()
        const { left, top, right, bottom } = boundingClientRect

        return { left, top, right, bottom }
    }, [])

    const focusableChildrenRef = React.useRef<ChildrenMap>(new Map())
    const focusableChildren = focusableChildrenRef.current

    const getChildren = React.useCallback(() => focusableChildren, [focusableChildren])

    const getPreferredChild = React.useCallback(getPreferredNodeAmong(focusableChildren), [focusableChildren])

    const focusableTreeRoot = React.useMemo(
        () => ({
            focusKey: FOCUSABLE_TREE_ROOT_KEY,
            getParent: () => undefined,
            getBoundingBox,
            getChildren,
            getPreferredChild,
        }),
        [getChildren, getPreferredChild, getBoundingBox]
    )

    React.useEffect(() => {
        focusManager.setFocusableRoot(focusableTreeRoot)

        return () => {
            focusManager.clearFocusableRoot()
        }
    })

    const focusableTreeContextValue = React.useMemo(
        () => ({
            focusPath,
            parentFocusableNode: focusableTreeRoot,
            registerFocusable: registerFocusableIn(focusableChildren),
            unregisterFocusable: unregisterFocusableIn(focusableChildren),
        }),
        [focusPath.join(), focusableTreeRoot]
    )

    return (
        <FocusableTreeContext.Provider value={focusableTreeContextValue}>
            <div ref={wrapperRef}>{children}</div>
        </FocusableTreeContext.Provider>
    )
}
