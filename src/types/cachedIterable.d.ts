declare module 'cached-iterable' {

  export class CachedSyncIterable {
    static from<T>(iterable: Iterable<T>): Iterable<T>
  }
}
