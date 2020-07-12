declare module '@fluent/dedent' {
  export default function ftl(strings: TemplateStringsArray): string
}

declare module 'cached-iterable' {
  export class CachedSyncIterable {
    static from<T>(array: T[]): Iterable<T>
  }
}
