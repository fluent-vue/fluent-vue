export function assert(condition: boolean, message: string): asserts condition {
  if (!condition) {
    throw new Error(`[fluent-vue] ${message}`)
  }
}

export function warn(message: string, ...args: unknown[]): void {
  if (process.env.NODE_ENV !== 'production') {
    console.warn(`[fluent-vue] ${message}`, ...args)
  }
}
