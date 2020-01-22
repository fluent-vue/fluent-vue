import { FluentBundle, MessageInfo, Pattern } from '@fluent/bundle'

/**
 * Interface for objects that need to be updated when translation change
 */
export interface IUpdatable {
  /** Force update after translation change */
  $forceUpdate(): void
}

export interface FluentVueObject {
  getBundle(key: string): FluentBundle | null
  getMessage(bundle: FluentBundle | null, key: string): MessageInfo | null
  formatPattern(bundle: FluentBundle, message: Pattern, value?: object, errors?: string[]): string
  format(key: string, value?: object): string

  subscribe(vue: IUpdatable): void
  unsubscribe(vue: IUpdatable): void
}

export interface FluentVueOptions {
  bundles: FluentBundle[]
}
