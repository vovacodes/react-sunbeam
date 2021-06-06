import type { KeyPressManager } from "./types.js"

export type KeyboardKeyPressListener = (event: KeyboardEvent) => void

export class KeyboardKeyPressManager implements KeyPressManager<KeyboardEvent> {
    private keyDownListeners: KeyboardKeyPressListener[] | null = null

    public removeAllKeyDownListeners() {
        window.removeEventListener("keydown", this.onKeyDown)
        this.keyDownListeners = null
    }

    public addKeyDownListener(listener: KeyboardKeyPressListener) {
        if (!this.keyDownListeners) {
            this.keyDownListeners = []
            window.addEventListener("keydown", this.onKeyDown)
        }

        this.keyDownListeners.unshift(listener)
    }

    public removeKeyDownListener(listener: KeyboardKeyPressListener) {
        if (!this.keyDownListeners) return

        const index = this.keyDownListeners.indexOf(listener)
        if (index === -1) return

        this.keyDownListeners.splice(index, 1)

        if (this.keyDownListeners.length === 0) {
            window.removeEventListener("keydown", this.onKeyDown)
            this.keyDownListeners = null
        }
    }

    private notifyKeyDownListeners(event: KeyboardEvent): void {
        if (!this.keyDownListeners) return

        // go through the keyDownListeners as long as the event propagation is not cancelled
        for (const keyDownListener of this.keyDownListeners) {
            keyDownListener(event)
            if (event.cancelBubble) break
        }
    }

    private onKeyDown = (event: KeyboardEvent): void => {
        const { keyDownListeners } = this
        if (!keyDownListeners)
            throw new Error("`onKeyDown` is registered before `keyDownListeners` array is initialized")

        // clone the original event to handle its propagation in isolation
        const clonedEvent = new KeyboardEvent(event.type, event)

        this.notifyKeyDownListeners(clonedEvent)

        // cancel the original event if clonedEvent was cancelled
        if (clonedEvent.defaultPrevented) event.preventDefault()
    }
}
