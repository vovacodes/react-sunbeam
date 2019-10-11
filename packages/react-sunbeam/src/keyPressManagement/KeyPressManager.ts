export type KeyPressListener = (event: KeyboardEvent) => void

export class KeyPressManager {
    private listeners: KeyPressListener[] | null = null

    public removeAllListeners() {
        window.removeEventListener("keydown", this.onKeyDown)
        this.listeners = null
    }

    public addListener(listener: KeyPressListener) {
        if (!this.listeners) {
            this.listeners = []
            window.addEventListener("keydown", this.onKeyDown)
        }

        this.listeners.unshift(listener)
    }

    public removeListener(listener: KeyPressListener) {
        if (!this.listeners) return

        const index = this.listeners.indexOf(listener)
        if (index === -1) return

        this.listeners.splice(index, 1)
    }

    private onKeyDown = (event: KeyboardEvent): void => {
        const { listeners } = this
        if (!listeners) throw new Error("`onKeyDown` is registered before `listeners` array is initialized")

        let index = 0
        // clone the original event to handle its propagation in isolation
        const clonedEvent = new KeyboardEvent(event.type, event)
        // go through the listeners as long as the event propagation is not cancelled
        while (listeners[index]) {
            listeners[index](clonedEvent)
            if (clonedEvent.cancelBubble) break
            index++
        }
        // cancel the original event if clonedEvent was cancelled
        if (clonedEvent.defaultPrevented) event.preventDefault()
    }
}
