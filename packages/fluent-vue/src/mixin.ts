import { Vue } from 'vue/types/vue'
import FluentVue from './fluentVue'
import { FluentBundle } from '@fluent/bundle'
import { warn } from './util/warn'
import { negotiateLanguages } from '@fluent/langneg'

function getParentFluent(component: Vue): FluentVue | undefined {
  const options = component.$options

  if (options.fluent && options.fluent instanceof FluentVue) {
    return options.fluent
  } else if (
      options.parent &&
      options.parent.$fluent &&
      options.parent.$fluent instanceof FluentVue) {
    return options.parent.$fluent
  } else {
    return undefined
  }
}

export default {
  beforeCreate(this: Vue): void {
    const fluent = getParentFluent(this)

    if (!fluent) {
      return
    }

    // If we override messages in a component
    // create new FluentVue instance with new bundles
    if (this.$options.__fluent) {
      const allLocales = fluent.allBundles.flatMap(bundle => bundle.locales)

      const overriddenBundles = Object.entries(this.$options.__fluent)
        .map(([locale, resources]) => {
          const locales = locale.split(/[\s+,]/)
          const parentLocale = negotiateLanguages(
            locales,
            allLocales, {
              strategy: 'lookup',
              defaultLocale: locales[0]
            })[0]
          const parentBundle = fluent.allBundles.find(bundle => bundle.locales.includes(parentLocale))
          if (!parentBundle) {
            warn(`Component ${this.$options.name} overides translations for locale "${locale}" that is not in your bundles`)
            return null
          }

          // Copy options from parent bundle
          const bundle = new FluentBundle(locales, {
            useIsolating: parentBundle._useIsolating,
            functions: parentBundle._functions,
            transform: parentBundle._transform
          })

          // Copy messages from parent bundle
          bundle._messages = new Map(parentBundle._messages)
          bundle._terms = new Map(parentBundle._terms)

          // Add overrides
          bundle.addResource(resources, { allowOverrides: true })
          return bundle
        })
        .filter(bundle => bundle != null) as FluentBundle[]

      this._fluent = new FluentVue({
        locale: fluent.locale,
        bundles: overriddenBundles.concat(fluent.allBundles)
      })

      // TODO: Subscribe to parent bundle
    } else {
      this._fluent = fluent
    }

    this._fluent.subscribe(this)
  },

  beforeDestroy(this: Vue): void {
    if (!this._fluent) {
      return
    }

    this._fluent.unsubscribe(this)

    this.$nextTick(() => {
      this._fluent = undefined
    })
  },
}
