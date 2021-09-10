export function assert(value: unknown, message?: string | Error): asserts value {
    if (!value) {
        throw typeof message === "string" ? new TypeError(message) : message
    }
}
