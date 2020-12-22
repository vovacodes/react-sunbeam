import * as React from "react"
import { useEffect, useMemo, useRef, useState } from "react"
import { FOCUSABLE_TREE_ROOT_KEY } from "../../Constants.js"
import { FocusManagerContext } from "../../FocusManagerContext.js"
import type { CustomGetPreferredChildFn, FocusPath } from "../../types.js"
import type { FocusManager } from "../../FocusManager.js"
import {
    KeyPressListener,
    KeyPressManager,
    KeyPressTreeContextProvider,
    KeyPressTreeNode,
} from "../../../keyPressManagement/index.js"
import { useChildKeyPressTreeContextValue } from "../../hooks/useChildKeyPressTreeContextValue.js"
import useOnFocusUpdate from "./useOnFocusUpdate.js"
import { Dispatcher, DispatcherContext } from "../../Dispatcher.js"
import { FocusManagerInternalsContext } from "../../FocusManagerInternalsContext.js"
import { useFocusableNode } from "../../hooks/useFocusableNode.js"
import { FocusableParentContextProvider } from "../../FocusableParentContext.js"

type Props = {
    focusManager: FocusManager
    keyPressManager?: KeyPressManager
    children: React.ReactNode
    onFocusUpdate?: (event: { focusPath: FocusPath }) => void
    onKeyPress?: KeyPressListener
    getPreferredChildOnFocus?: CustomGetPreferredChildFn
}

export function Root({
    focusManager,
    keyPressManager: customKeyPressManager,
    children,
    onFocusUpdate,
    onKeyPress,
    getPreferredChildOnFocus,
}: Props) {
    useOnFocusUpdate(focusManager, onFocusUpdate)
    const [dispatcher] = useState(() => new Dispatcher())
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

    return (
        <FocusManagerInternalsContext.Provider value={focusManager}>
            <DispatcherContext.Provider value={dispatcher}>
                <FocusableParentContextProvider value={focusableTreeRoot}>
                    <KeyPressTreeContextProvider value={childKeyPressTreeContextValue}>
                        <FocusManagerContext.Provider value={focusManager}>
                            <div ref={wrapperRef}>{children}</div>
                        </FocusManagerContext.Provider>
                    </KeyPressTreeContextProvider>
                </FocusableParentContextProvider>
            </DispatcherContext.Provider>
        </FocusManagerInternalsContext.Provider>
    )
}
