import { FocusableNodesMap } from "./types"

export default function unregisterFocusableIn(focusableChildrenMap: FocusableNodesMap) {
    return (childFocusKey: string) => {
        if (!focusableChildrenMap.has(childFocusKey)) {
            throw new Error(
                `can't unregister Focusable child with focusKey=${childFocusKey}. There is no Focusable with such key registered`
            )
        }

        focusableChildrenMap.delete(childFocusKey)
    }
}
