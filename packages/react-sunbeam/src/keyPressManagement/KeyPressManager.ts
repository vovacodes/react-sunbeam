type Listener = (event: KeyboardEvent) => boolean | undefined

export class KeyPressManager {
    private listenersByKey: { [key: string]: Listener[] } = {}

    public constructor() {
        window.addEventListener("keydown", this.onKeyDown)
    }

    public teardown() {
        window.removeEventListener("keydown", this.onKeyDown)
    }

    public addListener(key: string, listener: Listener) {
        if (!this.listenersByKey[key]) {
            this.listenersByKey[key] = []
        }
        const keyListeners = this.listenersByKey[key]
        keyListeners.unshift(listener)
    }

    public removeListener(key: string, listener: Listener) {
        const keyListeners = this.listenersByKey[key]
        if (!keyListeners) return

        const index = keyListeners.indexOf(listener)
        if (index === -1) return

        keyListeners.splice(index, 1)
    }

    private onKeyDown = (event: KeyboardEvent): void => {
        const key = event.key
        const keyListeners = this.listenersByKey[key]
        if (!keyListeners) return

        let index = 0
        while (keyListeners[index] && keyListeners[index](event)) {
            index++
        }
    }
}
