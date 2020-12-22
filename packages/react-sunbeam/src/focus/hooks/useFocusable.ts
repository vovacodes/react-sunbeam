import { RefObject, useContext } from "react"
import type { CustomGetPreferredChildFn, FocusEvent } from "../types.js"
import type { Direction } from "../../spatialNavigation/index.js"
import type { KeyPressListener } from "../../keyPressManagement/index.js"
import { DispatcherContext } from "../Dispatcher.js"
import { useOnFocusedChange } from "./useOnFocusedChange.js"
import { useKeyPressTreeNode } from "./useKeyPressTreeNode.js"
import { useFocusableNode } from "./useFocusableNode.js"
import { useFocused } from "./useFocused.js"
import { branchNodeFrom, BranchNode } from "../branchNode.js"
import { useFocusManager } from "./useFocusManager.js"

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
    getPreferredChildOnFocus,
}: {
    elementRef: Element
    focusKey?: string
    focusable?: boolean
    lock?: Direction | Direction[]
    onKeyPress?: KeyPressListener
    onFocus?: (event: FocusEvent) => void
    onBlur?: (event: FocusEvent) => void
    getPreferredChildOnFocus?: CustomGetPreferredChildFn
}): { focused: boolean; path: string[]; node: BranchNode } {
    const focusManager = useFocusManager()
    const focusableNode = useFocusableNode(
        focusManager,
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

    const keyPressTreeNode = useKeyPressTreeNode({ onKeyPress, focused })

    return { focused, path, node: branchNodeFrom(focusableNode, keyPressTreeNode) }
}
