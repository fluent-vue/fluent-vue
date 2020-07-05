import { Vue } from 'vue/types/vue'
import FluentVue from './fluentVue'
import { FluentBundle } from '@fluent/bundle'
import { warn } from './util/warn'

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
      const bundles = fluent.bundles
        .map(bundle => {
          // Copy options to new bundle
          const newBundle = new FluentBundle(bundle.locales, {
            functions: bundle._functions,
            useIsolating: bundle._useIsolating,
            transform: bundle._transform
          })

          // Copy terms and messages
          newBundle._terms = bundle._terms
          newBundle._messages = bundle._messages

          return newBundle
        })

      // Add new messages to bundles
      for (const [lang, resources] of Object.entries(this.$options.__fluent)) {
        const bundle = bundles.find(bundle => bundle.locales.join(' ') === lang)
        if (!bundle) {
          warn(`Component ${this.$options.name} overides translations for locale "${lang}" that is not in your bundles`)
          continue
        }

        bundle.addResource(resources, { allowOverrides: true })
      }

      this._fluent = new FluentVue({
        bundles
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
