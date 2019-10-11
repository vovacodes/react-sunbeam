import { MutableRefObject, useCallback, useMemo } from "react"
import { KeyPressTreeNode, KeyPressTreeContextValue } from "../../keyPressManagement"

export function useChildKeyPressTreeContextValue(
    childKeyPressTreeNodeRef: MutableRefObject<KeyPressTreeNode | undefined>
) {
    const registerChildActiveKeyPressTreeNode = useCallback(
        (node: KeyPressTreeNode) => {
            childKeyPressTreeNodeRef.current = node
        },
        [childKeyPressTreeNodeRef]
    )
    const unregisterChildActiveKeyPressTreeNode = useCallback(
        (node: KeyPressTreeNode) => {
            if (childKeyPressTreeNodeRef.current === node) childKeyPressTreeNodeRef.current = undefined
        },
        [childKeyPressTreeNodeRef]
    )

    return useMemo<KeyPressTreeContextValue>(() => {
        return {
            registerActiveKeyPressTreeNode: registerChildActiveKeyPressTreeNode,
            unregisterActiveKeyPressTreeNode: unregisterChildActiveKeyPressTreeNode,
        }
    }, [registerChildActiveKeyPressTreeNode, unregisterChildActiveKeyPressTreeNode])
}
