import Vue, { VueConstructor } from 'vue'
import { CachedSyncIterable } from 'cached-iterable'
import { mapBundleSync } from '@fluent/sequence'
import { warn } from './util/warn'

import { Pattern, FluentBundle } from '@fluent/bundle'
import { FluentVueObject, IUpdatable, FluentVueOptions } from './interfaces'

/**
 * Main class of fluent-vue.
 * Holds fluent bundles and formats messages.
 */
export default class FluentVue implements FluentVueObject {
  private subscribers: Map<IUpdatable, boolean>
  private bundlesIterable: CachedSyncIterable<FluentBundle>
  private _bundles: FluentBundle[]

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

  get bundles(): FluentBundle[] {
    return this._bundles
  }

  set bundles(bundles: FluentBundle[]) {
    this._bundles = bundles
    this.bundlesIterable = CachedSyncIterable.from(this.bundles)

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
    this._bundles = options.bundles
    this.bundlesIterable = CachedSyncIterable.from(this.bundles)
  }

  getBundle(key: string): FluentBundle {
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

  formatPattern(bundle: FluentBundle, message: Pattern, value?: object): string {
    const errors: string[] = []
    const formatted = bundle.formatPattern(message, value, errors)

    for (const error of errors) {
      warn(`Error when formatting: ${error}`)
    }

    return formatted
  }

  format(key: string, value?: object): string {
    const context = this.getBundle(key)
    const message = this.getMessage(context, key)

    if (message === null || message.value === null) {
      return key
    }

    return this.formatPattern(context, message.value, value)
  }

  formatAttrs(key: string, value?: object): Record<string, string> {
    const context = this.getBundle(key)
    const message = this.getMessage(context, key)

    if (message === null || message.value === null) {
      return {}
    }

    const result: Record<string, string> = {}
    for (const [attrName, attrValue] of Object.entries(message.attributes)) {
      result[attrName] = this.formatPattern(context, attrValue, value)
    }

    return result
  }
}
