import type { KeyPressListener, KeyPressManager } from "./types.js"

export function combineKeyPressManagers<T1, T2>(
    manager1: KeyPressManager<T1>,
    manager2: KeyPressManager<T2>
): KeyPressManager<T1 | T2> {
    return {
        addKeyDownListener(listener: KeyPressListener<T1 | T2>): void {
            manager1.addKeyDownListener(listener)
            manager2.addKeyDownListener(listener)
        },
        removeKeyDownListener(listener: KeyPressListener<T1 | T2>): void {
            manager1.removeKeyDownListener(listener)
            manager2.removeKeyDownListener(listener)
        },
        removeAllKeyDownListeners(): void {
            manager1.removeAllKeyDownListeners()
            manager2.removeAllKeyDownListeners()
        },
    }
}
