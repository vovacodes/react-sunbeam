import { useEffect, useMemo, useRef } from "react"
import {
    KeyPressListener,
    KeyPressTreeContextValue,
    KeyPressTreeNode,
    useKeyPressTreeContext,
} from "../../keyPressManagement/index.js"
import { useChildKeyPressTreeContextValue } from "./useChildKeyPressTreeContextValue.js"

export function useKeyPressTreeNode({
    focused,
    onKeyDown,
    onKeyUp,
}: {
    focused: boolean
    onKeyDown: KeyPressListener | undefined
    onKeyUp: KeyPressListener | undefined
}): KeyPressTreeContextValue {
    const childKeyPressTreeNodeRef = useRef<KeyPressTreeNode | undefined>(undefined)
    const { registerActiveKeyPressTreeNode, unregisterActiveKeyPressTreeNode } = useKeyPressTreeContext()
    const keyDownListenerRef = useRef<KeyPressListener | undefined>(undefined)
    const keyUpListenerRef = useRef<KeyPressListener | undefined>(undefined)

    useEffect(() => {
        keyDownListenerRef.current = onKeyDown
        keyUpListenerRef.current = onKeyUp

        return () => {
            keyDownListenerRef.current = undefined
            keyUpListenerRef.current = undefined
        }
    }, [onKeyDown, onKeyUp])
    const keyPressTreeNode = useMemo<KeyPressTreeNode>(
        () => ({
            keyDownListenerRef,
            keyUpListenerRef,
            childKeyPressTreeNodeRef,
        }),
        []
    )
    useEffect(() => {
        if (focused && registerActiveKeyPressTreeNode) {
            registerActiveKeyPressTreeNode(keyPressTreeNode)
        }
        return () => {
            if (focused && unregisterActiveKeyPressTreeNode) {
                unregisterActiveKeyPressTreeNode(keyPressTreeNode)
            }
        }
    }, [focused, registerActiveKeyPressTreeNode, unregisterActiveKeyPressTreeNode, keyPressTreeNode])

    return useChildKeyPressTreeContextValue(childKeyPressTreeNodeRef)
}
