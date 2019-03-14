import { ChildrenMap, FocusableTreeNode } from "./types"

export default function registerFocusableIn(focusableChildrenMap: ChildrenMap) {
    return (focusableTreeNode: FocusableTreeNode) => {
        const { focusKey } = focusableTreeNode

        if (focusableChildrenMap.has(focusKey)) {
            throw new Error(
                `can't register Focusable child with focusKey=${focusKey}. ` + `This key is already registered`
            )
        }

        focusableChildrenMap.set(focusKey, focusableTreeNode)
    }
}
