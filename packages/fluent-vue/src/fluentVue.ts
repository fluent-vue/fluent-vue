import Vue from 'vue'
import { CachedSyncIterable } from 'cached-iterable'
import { mapBundleSync } from '@fluent/sequence'
import { negotiateLanguages } from '@fluent/langneg'
import { warn } from './util/warn'

import { FluentBundle, FluentArgument } from '@fluent/bundle'
import { FluentVueOptions, FluentVue, IUpdatable } from './interfaces'
import { Pattern } from '@fluent/bundle/esm/ast'
import install from './install'

function getOrderedBundles(
  requestedLocale: string | string[],
  bundles: FluentBundle[]
): FluentBundle[] {
  if (!Array.isArray(requestedLocale)) {
    requestedLocale = [requestedLocale]
  }

  const avaliableLocales = bundles.flatMap((bundle) => bundle.locales)
  const negotiatedLocales = negotiateLanguages(requestedLocale, avaliableLocales, {
    strategy: 'filtering',
  })

  const newBundles = negotiatedLocales.map((locale) =>
    bundles.find((bundle) => bundle.locales.includes(locale))
  )

  const dedupeBundles = newBundles
    .filter((bundle, i) => newBundles.indexOf(bundle) === i)
    .filter((bundle) => bundle != null) as FluentBundle[]

  return dedupeBundles
}

export class TranslationContext {
  private fluentVue: FluentVue
  private subscribers: Map<TranslationContext, boolean>
  private bundlesIterable: Iterable<FluentBundle>
  bundles: FluentBundle[]

  constructor(fluentVue: FluentVue, bundles: FluentBundle[]) {
    this.fluentVue = fluentVue
    this.subscribers = new Map()

    this.bundles = bundles
    const orderedBundles = getOrderedBundles(fluentVue.locale, bundles)
    this.bundlesIterable = CachedSyncIterable.from(orderedBundles)
  }

  /**
   * Refreshes context and depended contexts when locale changes
   */
  refresh() {
    const orderedBundles = getOrderedBundles(this.fluentVue.locale, this.bundles)
    this.bundlesIterable = CachedSyncIterable.from(orderedBundles)

    for (const subscriber of this.subscribers.keys()) {
      subscriber.refresh()
    }
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

/**
 * Creates FluentVue instance that can bu used on a Vue app.
 *
 * @param options - {@link FluentVueOptions}
 */
export function createFluentVue(options: FluentVueOptions): FluentVue {
  const subscribers: Map<IUpdatable, boolean> = new Map()
  const contexts: Map<TranslationContext, boolean> = new Map()
  let locale = options.locale

  const fluentVue: FluentVue = {
    getBundle: (key) => rootContext.getBundle(key),
    getMessage: (bundle, key) => rootContext.getMessage(bundle, key),
    formatPattern: (bundle, message, value) => rootContext.formatPattern(bundle, message, value),
    format: (key, value) => rootContext.format(key, value),
    formatAttrs: (key, value) => rootContext.formatAttrs(key, value),

    get locale() {
      return locale
    },

    set locale(value: string | string[]) {
      locale = value

      for (const context of contexts.keys()) {
        context.refresh()
      }

      for (const subscriber of subscribers.keys()) {
        subscriber.$forceUpdate()
      }
    },

    install(vue: typeof Vue) {
      return install(vue, this, rootContext)
    },

    subscribe(vue: IUpdatable) {
      subscribers.set(vue, true)
    },

    unsubscribe(vue: IUpdatable) {
      subscribers.delete(vue)
    },

    addContext(context: TranslationContext) {
      contexts.set(context, true)
    },

    removeContext(context: TranslationContext) {
      contexts.delete(context)
    },
  }

  const rootContext = new TranslationContext(fluentVue, options.bundles)
  contexts.set(rootContext, true)

  return fluentVue
}
