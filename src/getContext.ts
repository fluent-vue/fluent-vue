import type { FluentResource } from '@fluent/bundle'
import { CachedSyncIterable } from 'cached-iterable'
import { computed } from 'vue-demi'

import { inheritBundle } from './inheritBundle'
import { TranslationContext } from './TranslationContext'

function* flatMap<T, TR>(iterable: Iterable<T>, mapper: (element: T) => TR[]): IterableIterator<TR> {
  for (const item of iterable)
    yield* mapper(item)
}

export function getContext(
  rootContext: TranslationContext,
  instance: Record<string, any> | null | undefined,
  fromSetup = false,
): TranslationContext {
  if (instance == null)
    return rootContext

  const options = instance.$options ?? instance.type

  if (options._fluent != null)
    return options._fluent

  const context = getMergedContext(rootContext, options.fluent)

  // If we are in script setup, we cannot cache the context
  // because after component is unmounted, computed will not be updated
  // Additionally we cannot cache on the server, because server is not reactive
  const isServer = typeof window === 'undefined'
  if (!fromSetup && !isServer)
    options._fluent = context

  return context
}

/**
 * Get new translation context with overridden bundles
 * @param rootContext Root context with all bundles
 * @param fluent Fluent resources to override
 * @returns New translation context with overridden bundles
 */
export function getMergedContext(
  rootContext: TranslationContext,
  fluent?: Record<string, FluentResource>,
): TranslationContext {
  if (fluent == null)
    return rootContext

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

  return new TranslationContext(overriddenBundles, rootContext.options)
}
