import { CachedSyncIterable } from 'cached-iterable'
import { mapBundleSync } from '@fluent/sequence'
import { warn } from './util/warn'

import { FluentVueObject, FluentVueOptions } from '../types'
import { Vue, VueConstructor } from 'vue/types/vue'
import { Pattern, FluentBundle } from '@fluent/bundle'

export default class FluentVue implements FluentVueObject {
  bundles: CachedSyncIterable

  static install: (vue: VueConstructor<Vue>) => void

  constructor(options: FluentVueOptions) {
    this.bundles = CachedSyncIterable.from(options.bundles)
  }

  getBundle(key: string): FluentBundle {
    return mapBundleSync(this.bundles, key)
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
}
