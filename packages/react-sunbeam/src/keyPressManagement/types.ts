import { MutableRefObject } from "react"
import { KeyPressListener } from "./KeyPressManager"

export type KeyPressTreeNode = {
    listenerRef: MutableRefObject<KeyPressListener | undefined>
    childKeyPressTreeNodeRef: MutableRefObject<KeyPressTreeNode | undefined>
}
