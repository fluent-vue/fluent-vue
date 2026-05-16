import { promises as fs } from 'node:fs'

export function warn(...args: unknown[]) {
  console.warn('[unplugin-fluent-vue] ', ...args)
}

export function error(...args: unknown[]) {
  console.error('[unplugin-fluent-vue] ', ...args)
}

export async function getRaw(path: string): Promise<string> {
  return fs.readFile(path, { encoding: 'utf-8' })
}

export function raiseError(message: string) {
  throw new Error(`[unplugin-fluent-vue] ${message}`)
}
