import type { VueComponent } from './types/typesCompat'

import { TranslationContext } from './TranslationContext'
import { computed } from 'vue-demi'
import { inheritBundle } from './inheritBundle'

export function getContext (
  rootContext: TranslationContext,
  instance: VueComponent | null | undefined
): TranslationContext {
  if (instance == null) {
    return rootContext
  }

  const options = instance.$options

  const fluent = options.fluent
  if (fluent == null) {
    return rootContext
  }

  if (options._fluent != null) {
    return options._fluent
  }

  // If we override messages in a component
  // create new translation context with new bundles
  const overriddenBundles = computed(() => rootContext.bundles.value
    .flatMap(parentBundle => Object.entries(fluent)
      .map(([locale, resources]) => {
        const locales = locale.split(/[\s+,]/)

        const matchingLocales = parentBundle.locales.filter(bundleLocale => locales.includes(bundleLocale))

        if (matchingLocales.length === 0) {
          return parentBundle
        }

        const bundle = inheritBundle(parentBundle.locales, parentBundle)
        bundle.addResource(resources, { allowOverrides: true })

        return bundle
      })
    )
  )

  const context = new TranslationContext(overriddenBundles)

  options._fluent = context

  return context
}
