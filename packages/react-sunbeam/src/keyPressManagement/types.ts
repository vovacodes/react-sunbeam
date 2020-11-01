import type { MutableRefObject } from "react"
import type { KeyPressListener } from "./KeyPressManager.js"

export type KeyPressTreeNode = {
    listenerRef: MutableRefObject<KeyPressListener | undefined>
    childKeyPressTreeNodeRef: MutableRefObject<KeyPressTreeNode | undefined>
}
