import * as React from "react"
import { FocusableTreeContext } from "../FocusableTreeContext"
import { BoundingBox } from "../../spatialNavigation"
import { ChildrenMap, FocusableTreeNode } from "../types"
import registerFocusableIn from "../registerFocusableIn"
import unregisterFocusableIn from "../unregisterFocusableIn"
import getPreferredNodeAmong from "../getPreferredNodeAmong"

interface Props {
    focusKey: string
    children: (focused: boolean) => React.ReactNode
    style?: React.CSSProperties
    className?: string
}

export function Focusable(props: Props) {
    const focusableChildrenRef = React.useRef<ChildrenMap>(new Map())
    const focusableChildren = focusableChildrenRef.current

    const { focusKey } = props

    const wrapperRef = React.useRef<HTMLDivElement | null>(null)
    const getBoundingBox = React.useCallback((): BoundingBox => {
        const wrapperElement = wrapperRef.current

        if (!wrapperElement) {
            throw new Error(
                `Attempting to get a bounding box of a not mounted ` + `Focusable with focusKey: ${focusKey}`
            )
        }

        const { left, top, right, bottom } = wrapperElement.getBoundingClientRect()

        return { left, top, right, bottom }
    }, [focusKey])

    const getChildren = React.useCallback(() => focusableChildren, [focusableChildren])

    const getPreferredChild = React.useCallback(getPreferredNodeAmong(focusableChildren), [focusableChildren])

    const focusContextValue = React.useContext(FocusableTreeContext)

    const { focusPath, parentFocusableNode, registerFocusable, unregisterFocusable } = focusContextValue

    const focusableTreeNode: FocusableTreeNode = React.useMemo(
        () => ({
            focusKey,
            getParent: () => parentFocusableNode,
            getChildren,
            getPreferredChild,
            getBoundingBox,
        }),
        [focusKey, parentFocusableNode, getChildren, getPreferredChild, getBoundingBox]
    )

    React.useEffect(() => {
        registerFocusable(focusableTreeNode)

        return () => unregisterFocusable(focusKey)
    }, [focusableTreeNode, focusKey])

    const [focusedSiblingFocusKey, ...restOfFocusPath] = focusPath
    const isFocused = focusedSiblingFocusKey === focusKey
    const childrenFocusPath = isFocused ? restOfFocusPath : []

    const childContextValue = React.useMemo(() => {
        return {
            focusPath: childrenFocusPath,
            parentFocusableNode: focusableTreeNode,
            registerFocusable: registerFocusableIn(focusableChildrenRef.current),
            unregisterFocusable: unregisterFocusableIn(focusableChildrenRef.current),
        }
    }, [childrenFocusPath.join(), focusableTreeNode])

    return (
        <FocusableTreeContext.Provider value={childContextValue}>
            <div ref={wrapperRef} className={props.className} style={props.style}>
                {props.children(isFocused)}
            </div>
        </FocusableTreeContext.Provider>
    )
}
