import type { FocusableNode } from "./FocusableNode.js"
import type { KeyPressTreeContextValue } from "../keyPressManagement/index.js"

declare const __container_symbol__: unique symbol
export type BranchNode = { symbol: typeof __container_symbol__ }

export function branchNodeFrom(
    focusableTreeNode: FocusableNode,
    keyPressTreeNode: KeyPressTreeContextValue
): BranchNode {
    return ([focusableTreeNode, keyPressTreeNode] as unknown) as BranchNode
}
