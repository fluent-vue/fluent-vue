import { CachedSyncIterable } from 'cached-iterable'
import { mapBundleSync } from '@fluent/sequence'
import { warn } from './util/warn'
import { FluentBundle, FluentVariable } from '@fluent/bundle'
import { Message, Pattern } from '@fluent/bundle/esm/ast'
import { computed, ComputedRef, Ref } from 'vue-demi'
import { getOrderedBundles } from './getOrderedBundles'

export class TranslationContext {
  locale: Ref<string | string[]>
  bundles: Ref<FluentBundle[]>
  bundlesIterable: ComputedRef<Iterable<FluentBundle>>

  constructor(locale: Ref<string | string[]>, bundles: Ref<FluentBundle[]>) {
    this.locale = locale
    this.bundles = bundles
    this.bundlesIterable = computed(() =>
      CachedSyncIterable.from(getOrderedBundles(this.locale.value, bundles.value))
    )
  }

  getBundle(key: string): FluentBundle | null {
    return mapBundleSync(this.bundlesIterable.value, key)
  }

  getMessage(bundle: FluentBundle | null, key: string): Message | null {
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
    value?: Record<string, FluentVariable>
  ): string {
    const errors: Error[] = []
    const formatted = bundle.formatPattern(message, value, errors)

    for (const error of errors) {
      warn(`Error when formatting: ${error}`)
    }

    return formatted
  }

  format = (key: string, value?: Record<string, FluentVariable>): string => {
    const context = this.getBundle(key)
    const message = this.getMessage(context, key)

    if (context === null || message === null || message.value === null) {
      return key
    }

    return this.formatPattern(context, message.value, value)
  }

  formatAttrs = (key: string, value?: Record<string, FluentVariable>): Record<string, string> => {
    const context = this.getBundle(key)
    const message = this.getMessage(context, key)

    if (context === null || message === null) {
      return {}
    }

    const result: Record<string, string> = {}
    for (const [attrName, attrValue] of Object.entries(message.attributes)) {
      result[attrName] = this.formatPattern(context, attrValue, value)
    }

    return result
  }
}
