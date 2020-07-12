import Vue from 'vue/types/umd'
import { FluentBundle, FluentArgument } from '@fluent/bundle'
import { Message, Pattern } from '@fluent/bundle/esm/ast'
import { TranslationContext } from './fluentVue'

/**
 * Interface for objects that need to be updated when translation change
 */
export interface IUpdatable {
  /** Force update after translation change */
  $forceUpdate(): void
}

export interface FluentVue {
  locale: string | string[]

  install(vue: typeof Vue): void

  getBundle(key: string): FluentBundle | null
  getMessage(bundle: FluentBundle | null, key: string): Message | null
  formatPattern(
    bundle: FluentBundle,
    message: Pattern,
    value?: Record<string, FluentArgument>,
    errors?: string[]
  ): string
  format(key: string, value?: Record<string, FluentArgument>): string
  formatAttrs(key: string, value?: Record<string, FluentArgument>): Record<string, string>

  subscribe(vue: IUpdatable): void
  unsubscribe(vue: IUpdatable): void

  addContext(context: TranslationContext): void
  removeContext(context: TranslationContext): void
}

export interface FluentVueOptions {
  /** Currently selected locale */
  locale: string | string[]
  /** List of bundles used in application */
  bundles: FluentBundle[]
}
