import { createContext } from "react"

/**
 * Dispatcher is responsible for onFocus/onBlur scheduling.
 * All the dispatchOnFocus/dispatchOnBlur calls happen synchronously in the same macrotask
 * their order is defined by the order of useEffect() execution by React, which is child -> parent.
 *
 * Dispatcher will accumulate all the calls and fire the callbacks in the right order
 * at the end of the current macrotask:
 *
 * childOnBlur -> parentOnBlur -> parentOnFocus -> childOnFocus
 */
export class Dispatcher {
    private onFocusDispatchQueue: (() => void)[] = []
    private onBlurDispatchQueue: (() => void)[] = []
    private shouldExhaustEventQueues = true

    public dispatchOnFocus(onFocusHandler: () => void) {
        this.onFocusDispatchQueue.push(onFocusHandler)
        this.scheduleEventQueuesProcessingIfNeeded()
    }

    public dispatchOnBlur(onBlurHandler: () => void) {
        this.onBlurDispatchQueue.push(onBlurHandler)
        this.scheduleEventQueuesProcessingIfNeeded()
    }

    private scheduleEventQueuesProcessingIfNeeded() {
        // Make sure the queues are processed only once during the same macrotask.
        if (!this.shouldExhaustEventQueues) return
        this.shouldExhaustEventQueues = false

        // Schedule as microtask at the end of the current macrotask.
        Promise.resolve().then(() => {
            // 1. Process onBlur in FIFO order (child -> parent)
            let onBlur = this.onBlurDispatchQueue.shift()
            while (onBlur) {
                try {
                    onBlur()
                } catch (err) {
                    console.error("There was an error in onBlur handler", err)
                }
                onBlur = this.onBlurDispatchQueue.shift()
            }

            // 2. Then onFocus in FILO order (parent -> child)
            let onFocus = this.onFocusDispatchQueue.pop()
            while (onFocus) {
                try {
                    onFocus()
                } catch (err) {
                    console.error("There was an error in onFocus handler", err)
                }
                onFocus = this.onFocusDispatchQueue.pop()
            }
            this.shouldExhaustEventQueues = true
        })
    }
}

export const DispatcherContext = createContext<Dispatcher>(new Dispatcher())
