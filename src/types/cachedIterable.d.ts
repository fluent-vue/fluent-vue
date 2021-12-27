declare module 'cached-iterable' {
  // eslint-disable-next-line @typescript-eslint/no-extraneous-class
  export class CachedSyncIterable {
    static from<T>(iterable: Iterable<T>): Iterable<T>
  }
}
