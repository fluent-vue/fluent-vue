import { computed, getCurrentInstance, inject } from 'vue-demi'
import { FluentBundle } from '@fluent/bundle'
import { negotiateLanguages } from '@fluent/langneg'
import { warn } from './util/warn'
import { TranslationContext } from './TranslationContext'
import { inheritBundle } from './inheritBundle'
import { RootContextSymbol } from './symbols'

export function getContext(rootContext: TranslationContext, instance: any): TranslationContext {
  if (instance == null) {
    return rootContext
  }

  const target = instance.$options ?? instance.type
  if (target._fluent != null) {
    return target._fluent
  }

  let context = rootContext

  // If we override messages in a component
  // create new translation context with new bundles
  if (target.fluent) {
    const overriddenBundles = computed(() => {
      const allLocales = rootContext.bundles.value.flatMap((bundle) => bundle.locales)

      return Object.entries(target.fluent)
        .map(([locale, resources]) => {
          const locales = locale.split(/[\s+,]/)
          const parentLocale = negotiateLanguages(locales, allLocales, {
            strategy: 'lookup',
            defaultLocale: locales[0],
          })[0]
          const parentBundle = rootContext.bundles.value.find((bundle) =>
            bundle.locales.includes(parentLocale)
          )

          if (!parentBundle) {
            warn(
              `Component ${target.name} overides translations for locale "${locale}" that is not in your bundles`
            )
            return null
          }

          const bundle = inheritBundle(locales, parentBundle)
          bundle.addResource(resources as any, { allowOverrides: true })
          return bundle
        })
        .filter((bundle) => bundle != null) as FluentBundle[]
    })

    const allBundles = computed(() => overriddenBundles.value.concat(rootContext.bundles.value))

    context = new TranslationContext(rootContext.locale, allBundles)
  }

  target._fluent = context

  return context
}

export function useFluent(): TranslationContext {
  const instance = getCurrentInstance()
  if (instance == null) {
    const error = 'useFluent called outside of setup'
    warn(error)
    throw error
  }

  const rootContext = inject(RootContextSymbol)
  if (rootContext == null) {
    const error = 'useFluent called without instaling plugin'
    warn(error)
    throw error
  }

  return getContext(rootContext, instance)
}
