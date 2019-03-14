import { createContext } from "react"

interface SunbeamContextValue {
    moveRight(): void
    moveLeft(): void
    moveUp(): void
    moveDown(): void
    //setFocus:
}

export const SunbeamContext = createContext<SunbeamContextValue | null>(null)
