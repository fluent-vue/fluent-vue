export function assert(condition: any, message: string) {
  if (!condition) {
    throw new Error(`[fluent-vue] ${message}`)
  }
}

export function warn(condition: any, message: string) {
  if (process.env.NODE_ENV !== 'production' && !condition) {
    console.warn(`[fluent-vue] ${message}`)
  }
}
