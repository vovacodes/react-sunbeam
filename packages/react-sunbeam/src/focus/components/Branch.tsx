import React, { ReactNode } from "react"
import { FocusableParentContextProvider } from "../FocusableParentContext.js"
import type { FocusableNode } from "../FocusableNode.js"
import type { BranchNode } from "../branchNode.js"
import { KeyPressTreeContextProvider, KeyPressTreeContextValue } from "../../keyPressManagement/index.js"

export function Branch({ node, children }: { node: BranchNode; children: ReactNode }) {
    const [focusableTreeNode, keyPressTreeNode] = (node as unknown) as [FocusableNode, KeyPressTreeContextValue]

    return (
        <FocusableParentContextProvider value={focusableTreeNode}>
            <KeyPressTreeContextProvider value={keyPressTreeNode}>{children}</KeyPressTreeContextProvider>
        </FocusableParentContextProvider>
    )
}
