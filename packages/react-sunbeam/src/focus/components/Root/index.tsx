import * as React from "react"
import { useEffect, useMemo, useRef, useState } from "react"
import { FOCUSABLE_TREE_ROOT_KEY } from "../../Constants.js"
import { FocusManagerContext } from "../../FocusManagerContext.js"
import type { CustomGetPreferredChildFn, FocusPath } from "../../types.js"
import type { FocusManager } from "../../FocusManager.js"
import {
    KeyPressListener,
    KeyPressTreeContextProvider,
    KeyPressTreeNode,
    KeyPressManager,
    KeyboardKeyPressManager,
    KeyPressEvent,
} from "../../../keyPressManagement/index.js"
import { useChildKeyPressTreeContextValue } from "../../hooks/useChildKeyPressTreeContextValue.js"
import useOnFocusUpdate from "./useOnFocusUpdate.js"
import { Dispatcher, DispatcherContext } from "../../Dispatcher.js"
import { FocusManagerInternalsContext } from "../../FocusManagerInternalsContext.js"
import { useFocusableNode } from "../../hooks/useFocusableNode.js"
import { FocusableParentContextProvider } from "../../FocusableParentContext.js"

type Props<E = KeyPressEvent> = {
    focusManager: FocusManager
    keyPressManager?: KeyPressManager<unknown>
    children: React.ReactNode
    onFocusUpdate?: (event: { focusPath: FocusPath }) => void
    onKeyDown?: (event: E extends KeyPressEvent ? E : unknown) => void
    getPreferredChildOnFocus?: CustomGetPreferredChildFn
    as?: keyof JSX.IntrinsicElements
} & Omit<React.HTMLAttributes<any>, "onKeyDown">

export function Root<E = KeyPressEvent>({
    focusManager,
    keyPressManager: customKeyPressManager,
    children,
    onFocusUpdate,
    onKeyDown,
    getPreferredChildOnFocus,
    as = "div",
    ...htmlProps
}: Props<E>) {
    useOnFocusUpdate(focusManager, onFocusUpdate)
    const [dispatcher] = useState(() => new Dispatcher())

    // This is an unsafe coercion that makes TS happy, but we are fine with that
    // because we only care about `el.getBoundingClientRect()` which all intrinsic elements have.
    const WrapperComponent = as as "div"
    const wrapperRef = useRef<HTMLDivElement | null>(null)

    const focusableTreeRoot = useFocusableNode(
        focusManager,
        wrapperRef,
        FOCUSABLE_TREE_ROOT_KEY,
        true,
        undefined,
        getPreferredChildOnFocus
    )

    useEffect(() => {
        focusManager.setFocusableRoot(focusableTreeRoot)
        return () => {
            focusManager.clearFocusableRoot()
        }
    }, [focusManager, focusableTreeRoot])

    // ====================================
    // Key press management
    // ====================================
    const childKeyPressTreeNodeRef = useRef<KeyPressTreeNode | undefined>(undefined)
    const keyPressManager = useMemo<KeyPressManager<unknown>>(() => {
        if (customKeyPressManager != null) return customKeyPressManager
        return new KeyboardKeyPressManager()
    }, [customKeyPressManager])
    useEffect(() => {
        keyPressManager.addKeyDownListener(keyPressListener)
        function keyPressListener(event: unknown) {
            // first build up the array of listeners from the root to the leaf
            const listeners: KeyPressListener[] = onKeyDown ? [onKeyDown as KeyPressListener] : []
            let keyPressTreeNode: KeyPressTreeNode | undefined = childKeyPressTreeNodeRef.current
            while (keyPressTreeNode) {
                const listener = keyPressTreeNode.listenerRef.current
                if (listener) listeners.push(listener)
                keyPressTreeNode = keyPressTreeNode.childKeyPressTreeNodeRef.current
            }
            // then process this array from the leaf to the root
            for (let i = listeners.length - 1; i >= 0; i--) {
                const listener = listeners[i]
                listener(event as KeyPressEvent)
                if ((event as KeyPressEvent).cancelBubble) break
            }
        }

        return () => {
            keyPressManager.removeKeyDownListener(keyPressListener)
        }
    }, [onKeyDown, keyPressManager])
    const childKeyPressTreeContextValue = useChildKeyPressTreeContextValue(childKeyPressTreeNodeRef)

    return (
        <FocusManagerInternalsContext.Provider value={focusManager}>
            <DispatcherContext.Provider value={dispatcher}>
                <FocusableParentContextProvider value={focusableTreeRoot}>
                    <KeyPressTreeContextProvider value={childKeyPressTreeContextValue}>
                        <FocusManagerContext.Provider value={focusManager}>
                            <WrapperComponent ref={wrapperRef} {...htmlProps}>
                                {children}
                            </WrapperComponent>
                        </FocusManagerContext.Provider>
                    </KeyPressTreeContextProvider>
                </FocusableParentContextProvider>
            </DispatcherContext.Provider>
        </FocusManagerInternalsContext.Provider>
    )
}
