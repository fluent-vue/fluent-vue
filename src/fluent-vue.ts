import Vue from 'vue'
import { CachedSyncIterable } from 'cached-iterable'
import { mapBundleSync } from '@fluent/sequence'
import { warn } from './util/warn'

import { FluentVueObject, FluentVueOptions } from './types'
import { VueConstructor } from 'vue/types/vue'
import { Pattern, FluentBundle } from '@fluent/bundle'

export default class FluentVue implements FluentVueObject {
  private subscribers: Map<Vue, boolean>
  private bundlesIterable: CachedSyncIterable
  private _bundles: FluentBundle[]

  subscribe(vue: Vue): void {
    this.subscribers.set(vue, true)
  }
  unsubscribe(vue: Vue): void {
    this.subscribers.delete(vue)
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

  constructor(options: FluentVueOptions) {
    this.subscribers = new Map<Vue, boolean>()
    this._bundles = options.bundles
    this.bundlesIterable = CachedSyncIterable.from(this.bundles)
  }

  getBundle(key: string): FluentBundle {
    return mapBundleSync(this.bundlesIterable, key)
  }

  getMessage(bundle: FluentBundle | null, key: string) {
    if (bundle === null) {
      warn(`Could not find translation for key [${key}]`)
      return null
    }

    const message = bundle.getMessage(key)

    if (message === undefined) {
      warn(`Could not find translation for key [${key}]`)
      return null
    }

    return message
  }

  formatPattern(bundle: FluentBundle, message: Pattern, value?: object, errors?: string[]): string {
    return bundle.formatPattern(message, value, errors)
  }

  format(key: string, value?: object): string {
    const context = this.getBundle(key)
    const message = this.getMessage(context, key)

    if (message === null || message.value === null) {
      return key
    }

    const errors: string[] = []
    const result = this.formatPattern(context, message.value, value, errors)

    for (const error of errors) {
      warn(`Fluent error for key [${key}]: ${error}`)
    }

    return result
  }

  formatAttrs(key: string, value?: object): object {
    const context = this.getBundle(key)
    const message = this.getMessage(context, key)

    if (message === null || message.value === null) {
      return {}
    }

    const errors: string[] = []
    const result = {}

    for (const [attrName, attrValue] of Object.entries(message.attributes)) {
      ;(result as any)[attrName] = this.formatPattern(context, attrValue, value, errors)
    }

    for (const error of errors) {
      warn(`Fluent error for key [${key}]: ${error}`)
    }

    return result
  }
}
