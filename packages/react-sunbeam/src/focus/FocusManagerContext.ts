import { createContext } from "react"

export interface FocusManagerAPI {
    moveRight(): void
    moveLeft(): void
    moveUp(): void
    moveDown(): void
    setFocus(focusPath: readonly string[]): void
    getFocusPath(): readonly string[]
}

/**
 * This context exposes the public-facing API for controlling focusManger while keeping the "internal" methods hidden.
 */
export const FocusManagerContext = createContext<FocusManagerAPI>({
    moveRight() {
        console.warn('Attempted to call "moveRight" without FocusManagerContext.Provider present in the tree')
    },
    moveLeft() {
        console.warn('Attempted to call "moveLeft" without FocusManagerContext.Provider present in the tree')
    },
    moveUp() {
        console.warn('Attempted to call "moveUp" without FocusManagerContext.Provider present in the tree')
    },
    moveDown() {
        console.warn('Attempted to call "moveDown" without FocusManagerContext.Provider present in the tree')
    },
    setFocus() {
        console.warn('Attempted to call "setFocus" without FocusManagerContext.Provider present in the tree')
    },
    getFocusPath() {
        console.warn('Attempted to call "getFocusPath" without FocusManagerContext.Provider present in the tree')
        return []
    },
})
