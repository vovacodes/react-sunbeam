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
    onKeyPress,
}: {
    focused: boolean
    onKeyPress: KeyPressListener | undefined
}): KeyPressTreeContextValue {
    const childKeyPressTreeNodeRef = useRef<KeyPressTreeNode | undefined>(undefined)
    const { registerActiveKeyPressTreeNode, unregisterActiveKeyPressTreeNode } = useKeyPressTreeContext()
    const listenerRef = useRef<KeyPressListener | undefined>(undefined)
    useEffect(() => {
        listenerRef.current = onKeyPress
        return () => {
            listenerRef.current = undefined
        }
    }, [onKeyPress])
    const keyPressTreeNode = useMemo<KeyPressTreeNode>(
        () => ({
            listenerRef,
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
