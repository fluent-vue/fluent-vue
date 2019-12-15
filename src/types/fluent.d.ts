declare module '@fluent/dedent' {
  export default function ftl(strings: TemplateStringsArray): string
}

declare module 'cached-iterable' {
  export class CachedSyncIterable<T> {
    static from<T>(array: T[]): CachedSyncIterable<T>
  }
}

declare module '@fluent/sequence' {
  import { CachedSyncIterable } from 'cached-iterable'
  import { FluentBundle } from '@fluent/bundle'

  export function mapBundleSync(
    iterable: CachedSyncIterable<FluentBundle>,
    key: string
  ): FluentBundle
}

declare module '@fluent/bundle' {
  export interface FluentBundleContructorOptions {
    functions?: object
    useIsolating?: boolean
    transform?: (...args: unknown[]) => unknown
  }

  export class FluentType {
    constructor(value: unknown, opts: object)
    toString(bundle: FluentBundle): string
    valueOf(): unknown
  }

  export class FluentNone extends FluentType {}
  export class FluentNumber extends FluentType {}
  export class FluentDateTime extends FluentType {}

  export type FluentNode = FluentType | string

  export class FluentResource {
    constructor(source: string)
  }

  class Pattern {}

  class MessageInfo {
    value: Pattern | null
    attributes: Record<string, Pattern>
  }

  export class FluentBundle {
    constructor(locales: string | string[], options?: FluentBundleContructorOptions)
    locales: string[]
    hasMessage(id: string): boolean
    getMessage(id: string): MessageInfo | undefined
    formatPattern(message: Pattern, args?: object, errors?: Array<string | Error>): string
    addResource(res: FluentResource): string[]
  }
}
