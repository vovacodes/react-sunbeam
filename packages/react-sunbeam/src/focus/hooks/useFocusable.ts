import { RefObject, useContext } from "react"
import type { CustomGetPreferredChildFn, FocusEvent } from "../types.js"
import type { Direction } from "../../spatialNavigation/index.js"
import type { KeyPressEvent, KeyPressListener } from "../../keyPressManagement/index.js"
import { DispatcherContext } from "../Dispatcher.js"
import { useOnFocusedChange } from "./useOnFocusedChange.js"
import { useKeyPressTreeNode } from "./useKeyPressTreeNode.js"
import { useFocusableNode } from "./useFocusableNode.js"
import { useFocused } from "./useFocused.js"
import { branchNodeFrom, BranchNode } from "../branchNode.js"
import { useFocusManagerInternals } from "./useFocusManagerInternals.js"

// TODO: add other options: () => ClientRect | ClientRect
type Element = RefObject<{
    getBoundingClientRect(): ClientRect
}>

export function useFocusable<E = KeyPressEvent>({
    elementRef,
    focusKey,
    focusable = true,
    lock = [],
    onKeyDown,
    onFocus,
    onBlur,
    getPreferredChildOnFocus,
}: {
    elementRef: Element
    focusKey?: string
    focusable?: boolean
    lock?: Direction | Direction[]
    onKeyDown?: (event: E extends KeyPressEvent ? E : unknown) => void
    onFocus?: (event: FocusEvent) => void
    onBlur?: (event: FocusEvent) => void
    getPreferredChildOnFocus?: CustomGetPreferredChildFn
}): { focused: boolean; path: string[]; node: BranchNode } {
    const focusManagerInternals = useFocusManagerInternals()
    const focusableNode = useFocusableNode(
        focusManagerInternals,
        elementRef,
        focusKey,
        focusable,
        lock,
        getPreferredChildOnFocus
    )

    const path = focusableNode.getPath()
    const focused = useFocused(path)
    const dispatcher = useContext(DispatcherContext)

    useOnFocusedChange(focused, (isFocused) => {
        const element = elementRef.current
        if (!element) return
        if (isFocused && onFocus) {
            dispatcher.dispatchOnFocus(() => {
                onFocus({
                    getBoundingClientRect: () => element.getBoundingClientRect(),
                    focusablePath: focusableNode.getPath(),
                })
            })
        } else if (onBlur) {
            dispatcher.dispatchOnBlur(() => {
                onBlur({
                    getBoundingClientRect: () => element.getBoundingClientRect(),
                    focusablePath: focusableNode.getPath(),
                })
            })
        }
    })

    const keyPressTreeNode = useKeyPressTreeNode({ onKeyPress: onKeyDown as KeyPressListener, focused })

    return { focused, path, node: branchNodeFrom(focusableNode, keyPressTreeNode) }
}
