import React, { ReactNode } from "react"
import { FocusableParentContextProvider } from "../FocusableParentContext.js"
import type { FocusableNode } from "../FocusableNode.js"
import type { FocusContainerSymbol } from "../focusContainerSymbol.js"
import { KeyPressTreeContextProvider, KeyPressTreeContextValue } from "../../keyPressManagement/index.js"

export function FocusContainer({ symbol, children }: { symbol: FocusContainerSymbol; children: ReactNode }) {
    const [focusableTreeNode, keyPressTreeNode] = (symbol as unknown) as [FocusableNode, KeyPressTreeContextValue]

    return (
        <FocusableParentContextProvider value={focusableTreeNode}>
            <KeyPressTreeContextProvider value={keyPressTreeNode}>{children}</KeyPressTreeContextProvider>
        </FocusableParentContextProvider>
    )
}
