import { computed } from 'vue-demi'
import { CachedSyncIterable } from 'cached-iterable'
import type { VueComponent } from './types/typesCompat'

import { TranslationContext } from './TranslationContext'
import { inheritBundle } from './inheritBundle'

function * flatMap<T, TR>(iterable: Iterable<T>, mapper: (element: T) => TR[]): IterableIterator<TR> {
  for (const item of iterable)
    yield * mapper(item)
}

export function getContext(
  rootContext: TranslationContext,
  instance: VueComponent | null | undefined,
  fromSetup = false,
): TranslationContext {
  if (instance == null)
    return rootContext

  const options = instance.$options

  const fluent = options.fluent
  if (fluent == null)
    return rootContext

  if (options._fluent != null)
    return options._fluent

  // If we override messages in a component
  // create new translation context with new bundles
  const overriddenBundles = computed(() =>
    CachedSyncIterable.from(
      flatMap(rootContext.bundles.value, parentBundle => Object.entries(fluent)
        .map(([locale, resources]) => {
          const locales = locale.split(/[\s+,]/)

          const matchingLocales = parentBundle.locales.filter(bundleLocale => locales.includes(bundleLocale))

          if (matchingLocales.length === 0)
            return parentBundle

          const bundle = inheritBundle(locales, parentBundle)
          bundle.addResource(resources, { allowOverrides: true })

          return bundle
        })),
    ),
  )

  const context = new TranslationContext(overriddenBundles, rootContext.options)

  // If we are in script setup, we cannot cache the context
  // because after component is unmounted, computed will not be updated
  if (!fromSetup)
    options._fluent = context

  return context
}
