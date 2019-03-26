import { createContext } from "react"

export interface SunbeamContextValue {
    moveFocusRight(): void
    moveFocusLeft(): void
    moveFocusUp(): void
    moveFocusDown(): void
    setFocus: (focusPath: string[]) => void
}

export const SunbeamContext = createContext<SunbeamContextValue | null>(null)
