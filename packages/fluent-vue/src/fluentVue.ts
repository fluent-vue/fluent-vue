import Vue, { VueConstructor } from 'vue'
import { CachedSyncIterable } from 'cached-iterable'
import { mapBundleSync } from '@fluent/sequence'
import { negotiateLanguages } from '@fluent/langneg'
import { warn } from './util/warn'

import { FluentBundle, FluentArgument } from '@fluent/bundle'
import { FluentVueObject, IUpdatable, FluentVueOptions } from './interfaces'
import { Pattern } from '@fluent/bundle/esm/ast'

/**
 * Main class of fluent-vue.
 * Holds fluent bundles and formats messages.
 */
export default class FluentVue implements FluentVueObject {
  private subscribers: Map<IUpdatable, boolean>
  private bundlesIterable: Iterable<FluentBundle>
  private _locale: string|string[]

  allBundles: FluentBundle[]

  /**
   * Add object to list of objects to notify
   * @param updatable Object to add to list
   */
  subscribe(updatable: IUpdatable): void {
    this.subscribers.set(updatable, true)
  }
  /**
   * Remove object from list of object to notify
   * @param updatable Object remove from list
   */
  unsubscribe(updatable: IUpdatable): void {
    this.subscribers.delete(updatable)
  }

  get locale(): string|string[] {
    return this._locale
  }

  set locale (value: string|string[]) {
    this._locale = value
    const orderedBundles = this.getOrderedBundles(value, this.allBundles)
    this.bundlesIterable = CachedSyncIterable.from(orderedBundles)

    for (const subscriber of this.subscribers.keys()) {
      subscriber.$forceUpdate()
    }
  }

  static install: (vue: VueConstructor<Vue>) => void

  /**
   * Constructs new instance of FluentVue class.
   * @param options Initialization options
   */
  constructor(options: FluentVueOptions) {
    this.subscribers = new Map<Vue, boolean>()
    this.allBundles = options.bundles
    this._locale = options.locale
    const orderedBundles = this.getOrderedBundles(options.locale, this.allBundles)
    this.bundlesIterable = CachedSyncIterable.from(orderedBundles)
  }

  private getOrderedBundles (requestedLocale: string|string[], bundles: FluentBundle[]): FluentBundle[] {
    if (!Array.isArray(requestedLocale)) {
      requestedLocale = [requestedLocale]
    }

    const avaliableLocales = bundles.flatMap(bundle => bundle.locales)
    const negotiatedLocales = negotiateLanguages(
      requestedLocale,
      avaliableLocales, {
        strategy: 'filtering'
      })

    const newBundles = negotiatedLocales
      .map(locale => bundles.find(bundle => bundle.locales.includes(locale)))

    const dedupeBundles = newBundles
      .filter((bundle, i) => newBundles.indexOf(bundle) === i)
      .filter(bundle => bundle != null) as FluentBundle[]

    return dedupeBundles
  }

  getBundle(key: string): FluentBundle | null {
    return mapBundleSync(this.bundlesIterable, key)
  }

  getMessage(bundle: FluentBundle | null, key: string) {
    const message = bundle?.getMessage(key)

    if (message === undefined) {
      warn(`Could not find translation for key [${key}]`)
      return null
    }

    return message
  }

  formatPattern(
    bundle: FluentBundle,
    message: Pattern,
    value?: Record<string, FluentArgument>
  ): string {
    const errors: Error[] = []
    const formatted = bundle.formatPattern(message, value, errors)

    for (const error of errors) {
      warn(`Error when formatting: ${error}`)
    }

    return formatted
  }

  format(key: string, value?: Record<string, FluentArgument>): string {
    const context = this.getBundle(key)
    const message = this.getMessage(context, key)

    if (context === null || message === null || message.value === null) {
      return key
    }

    return this.formatPattern(context, message.value, value)
  }

  formatAttrs(key: string, value?: Record<string, FluentArgument>): Record<string, string> {
    const context = this.getBundle(key)
    const message = this.getMessage(context, key)

    if (context === null || message === null || message.value === null) {
      return {}
    }

    const result: Record<string, string> = {}
    for (const [attrName, attrValue] of Object.entries(message.attributes)) {
      result[attrName] = this.formatPattern(context, attrValue, value)
    }

    return result
  }
}
