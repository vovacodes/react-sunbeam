import type { FocusableNode } from "./FocusableNode.js"
import type { KeyPressTreeContextValue } from "../keyPressManagement/index.js"

declare const __container_symbol__: unique symbol
export type FocusContainerSymbol = { symbol: typeof __container_symbol__ }

export function createFocusContainerSymbol(
    focusableTreeNode: FocusableNode,
    keyPressTreeNode: KeyPressTreeContextValue
): FocusContainerSymbol {
    return ([focusableTreeNode, keyPressTreeNode] as unknown) as FocusContainerSymbol
}
