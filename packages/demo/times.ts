export function times<T>(n: number, callback: (i: number) => T): Array<T> {
    const result: Array<T> = []

    for (let i = 1; i <= n; i++) {
        result.push(callback(i))
    }

    return result
}
