import { RefObject, useCallback, useContext, useEffect, useRef, useState } from "react"
import { assert } from "../../shared/assert.js"
import type { BoundingBox, Direction } from "../../spatialNavigation/index.js"
import type { CustomGetPreferredChildFn, FocusKey } from "../types.js"
import { FocusableParentContext } from "../FocusableParentContext.js"
import { FocusableNode } from "../FocusableNode.js"
import { FOCUSABLE_TREE_ROOT_KEY } from "../Constants.js"

// TODO: add other options: () => ClientRect | ClientRect
type ElementRef = RefObject<{
    getBoundingClientRect(): ClientRect
}>

/**
 * Returns a referentially stable instance of a FocusableNode configured with the provided arguments.
 *
 * @param elementRef - must be referentially stable between calls
 * @param focusKey - must be referentially stable between calls
 * @param focusable - can change between calls
 * @param customGetPreferredChild - can change between calls
 * @param lock - can change between calls
 */
export function useFocusableNode(
    focusManagerAPI: { revalidateFocusPath(): void } | undefined,
    elementRef: ElementRef,
    focusKey: FocusKey | undefined,
    focusable: boolean,
    lock: Direction[] | Direction | undefined,
    customGetPreferredChild: CustomGetPreferredChildFn | undefined
): FocusableNode {
    const getBoundingBox = useCallback((): BoundingBox => {
        const wrapperElement = elementRef.current
        assert(wrapperElement, `Attempting to get a bounding box of a not mounted Focusable.`)

        const { left, top, right, bottom } = wrapperElement.getBoundingClientRect()
        return { left, top, right, bottom }
    }, [elementRef])

    // The value below is provided by the context,
    // so it can be `undefined` if we render a component in isolation (use case we want to support)
    // hence all the undefined handling in the code below.
    const parentFocusableNode = useContext(FocusableParentContext)

    // We are using useState here as a reliable replacement for useMemo.
    const [focusableNode] = useState(
        () =>
            new FocusableNode({
                focusManagerAPI: focusManagerAPI ?? { revalidateFocusPath() {} },
                focusKey,
                parentPath:
                    // We shouldn't include FOCUSABLE_TREE_ROOT_KEY into the focus path.
                    parentFocusableNode?.getFocusKey() === FOCUSABLE_TREE_ROOT_KEY
                        ? []
                        : parentFocusableNode?.getPath() ?? [],
                getBoundingBox: getBoundingBox,
                customGetPreferredChild,
                lock,
            })
    )

    // Register/unregister the node in the tree on mount/unmount.
    useEffect(() => {
        if (parentFocusableNode && focusable) {
            parentFocusableNode.registerChild(focusableNode)
        }

        return () => {
            if (!parentFocusableNode || !focusable) return
            parentFocusableNode.unregisterChild(focusableNode)
        }
    }, [focusable, focusableNode, parentFocusableNode])

    // Handle prop updates

    useEffect(() => {
        if (!customGetPreferredChild) return
        focusableNode.setCustomGetPreferredChild(customGetPreferredChild)
    }, [customGetPreferredChild, focusableNode])

    useEffect(() => {
        focusableNode.setLock(lock)
    }, [lock, focusableNode])

    // Focusable node stability checks

    const initializedRef = useRef(false)
    useEffect(() => {
        if (initializedRef.current) {
            throw new Error(
                `"focusKey" must be the same between re-renders, violation of this rule will break the focusable tree behaviour.`
            )
        }
    }, [focusKey])
    useEffect(() => {
        if (initializedRef.current) {
            throw new Error(
                `"parentFocusableNode" must be the same between re-renders, violation of this rule will break the focusable tree behaviour.`
            )
        }
    }, [parentFocusableNode])
    useEffect(() => {
        if (initializedRef.current) {
            throw new Error(
                `"elementRef" must be the same between re-renders, violation of this rule will break the focusable tree behaviour.`
            )
        }
    }, [elementRef])
    useEffect(() => {
        initializedRef.current = true
    }, [])

    return focusableNode
}
