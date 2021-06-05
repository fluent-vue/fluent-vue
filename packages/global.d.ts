declare module '@fluent/dedent' {
  export default function ftl (strings: TemplateStringsArray): string
}

declare module 'cached-iterable' {
  // eslint-disable-next-line @typescript-eslint/no-extraneous-class
  export class CachedSyncIterable {
    static from<T>(array: T[]): Iterable<T>
  }
}
