import type { MutableRefObject } from "react"
import type { SyntheticGamepadKeyEvent } from "./GamepadKeyPressManager.js"

export type KeyPressEvent = KeyboardEvent | SyntheticGamepadKeyEvent

export type KeyPressListener<E = KeyPressEvent> = (event: E) => void

/**
 * This defines a minimal interface for a global key press manager implementation.
 * It is generic over the type of the event the manager passes to its listeners.
 */
export interface KeyPressManager<E = KeyPressEvent> {
    addKeyDownListener(listener: KeyPressListener<E>): void
    removeKeyDownListener(listener: KeyPressListener<E>): void
    removeAllKeyDownListeners(): void

    addKeyUpListener(listener: KeyPressListener<E>): void
    removeKeyUpListener(listener: KeyPressListener<E>): void
    removeAllKeyUpListeners(): void
}

export type KeyPressTreeNode = {
    keyDownListenerRef: MutableRefObject<KeyPressListener | undefined>
    keyUpListenerRef: MutableRefObject<KeyPressListener | undefined>
    childKeyPressTreeNodeRef: MutableRefObject<KeyPressTreeNode | undefined>
}
