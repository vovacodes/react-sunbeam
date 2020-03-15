import { createContext } from "react"

export interface SunbeamContextValue {
    moveFocusRight(): void
    moveFocusLeft(): void
    moveFocusUp(): void
    moveFocusDown(): void
    setFocus: (focusPath: readonly string[]) => void
}

export const SunbeamContext = createContext<SunbeamContextValue>({
    moveFocusRight() {
        console.warn('Attempted to call "moveFocusRight" without SunbeamContext.Provider present in the tree')
    },
    moveFocusLeft() {
        console.warn('Attempted to call "moveFocusLeft" without SunbeamContext.Provider present in the tree')
    },
    moveFocusUp() {
        console.warn('Attempted to call "moveFocusUp" without SunbeamContext.Provider present in the tree')
    },
    moveFocusDown() {
        console.warn('Attempted to call "moveFocusDown" without SunbeamContext.Provider present in the tree')
    },
    setFocus() {
        console.warn('Attempted to call "setFocus" without SunbeamContext.Provider present in the tree')
    },
})
