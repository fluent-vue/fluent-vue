import type { VueComponent } from './types/typesCompat'
import type { FluentBundle } from '@fluent/bundle'

import { TranslationContext } from './TranslationContext'
import { negotiateLanguages } from '@fluent/langneg'
import { computed } from 'vue-demi'
import { inheritBundle } from './inheritBundle'
import { warn } from './util/warn'

export function getContext (
  rootContext: TranslationContext,
  instance: VueComponent | null | undefined
): TranslationContext {
  if (instance == null) {
    return rootContext
  }

  const options = instance.$options
  if (options._fluent != null) {
    return options._fluent
  }

  let context = rootContext

  // If we override messages in a component
  // create new translation context with new bundles
  const fluent = options.fluent
  if (fluent != null) {
    const overriddenBundles = computed(() => {
      const allLocales = rootContext.bundles.value.flatMap((bundle) => bundle.locales)

      return Object.entries(fluent)
        .map(([locale, resources]) => {
          const locales = locale.split(/[\s+,]/)
          const parentLocale = negotiateLanguages(locales, allLocales, {
            strategy: 'lookup',
            defaultLocale: locales[0]
          })[0]
          const parentBundle = rootContext.bundles.value.find((bundle) =>
            bundle.locales.includes(parentLocale)
          )

          if (parentBundle == null) {
            warn(
              `Component ${options.name ?? '[no-name]'} overides translations for locale "${locale}" that is not in your bundles`
            )
            return null
          }

          const bundle = inheritBundle(locales, parentBundle)
          bundle.addResource(resources, { allowOverrides: true })
          return bundle
        })
        .filter((bundle) => bundle != null) as FluentBundle[]
    })

    const allBundles = computed(() => overriddenBundles.value.concat(rootContext.bundles.value))

    context = new TranslationContext(rootContext.locale, allBundles)
  }

  options._fluent = context

  return context
}
