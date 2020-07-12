import { Vue } from 'vue/types/vue'
import { FluentBundle } from '@fluent/bundle'
import { warn } from './util/warn'
import { negotiateLanguages } from '@fluent/langneg'
import { FluentVue } from './interfaces'
import { TranslationContext } from './fluentVue'
import { inheritBundle } from './inheritBundle'

export function createMixin(fluent: FluentVue, rootContext: TranslationContext) {
  return {
    beforeCreate(this: Vue): void {
      this._fluent = rootContext

      // If we override messages in a component
      // create new FluentVue instance with new bundles
      if (this.$options.__fluent) {
        const allLocales = rootContext.bundles.flatMap((bundle) => bundle.locales)

        const overriddenBundles = Object.entries(this.$options.__fluent)
          .map(([locale, resources]) => {
            const locales = locale.split(/[\s+,]/)
            const parentLocale = negotiateLanguages(locales, allLocales, {
              strategy: 'lookup',
              defaultLocale: locales[0],
            })[0]
            const parentBundle = rootContext.bundles.find((bundle) =>
              bundle.locales.includes(parentLocale)
            )
            if (!parentBundle) {
              warn(
                `Component ${this.$options.name} overides translations for locale "${locale}" that is not in your bundles`
              )
              return null
            }

            const bundle = inheritBundle(locales, parentBundle)
            bundle.addResource(resources, { allowOverrides: true })
            return bundle
          })
          .filter((bundle) => bundle != null) as FluentBundle[]

        const newContext = new TranslationContext(
          fluent,
          overriddenBundles.concat(rootContext.bundles)
        )

        fluent.addContext(newContext)

        this._fluent = newContext
      }

      fluent.subscribe(this)
    },

    beforeDestroy(this: Vue): void {
      if (!this._fluent) {
        return
      }

      fluent.removeContext(this._fluent)
      fluent.unsubscribe(this)

      this.$nextTick(() => {
        this._fluent = undefined
      })
    },
  }
}
