import type { FluentBundle, FluentVariable } from '@fluent/bundle'
import { isVue3, shallowRef } from 'vue-demi'
import type { FluentVueOptions } from './types'

import type { InstallFunction, Vue, Vue2, Vue3, Vue3Component } from './types/typesCompat'
import type { TranslationWithAttrs } from './TranslationContext'
import { TranslationContext } from './TranslationContext'
import { createVue2Directive, createVue3Directive } from './vue/directive'
import component from './vue/component'
import { getContext } from './getContext'
import { RootContextSymbol } from './symbols'
import { resolveOptions } from './util/options'

export { useFluent } from './composition'

export interface FluentVue {
  /** Current negotiated fallback chain of languages */
  bundles: Iterable<FluentBundle>

  format: (key: string, value?: Record<string, FluentVariable>) => string

  formatAttrs: (key: string, value?: Record<string, FluentVariable>) => Record<string, string>

  formatWithAttrs: (key: string, value?: Record<string, FluentVariable>) => TranslationWithAttrs

  install: InstallFunction
}

/**
 * Creates FluentVue instance that can be used on a Vue app.
 *
 * @param options - {@link FluentVueOptions}
 */
export function createFluentVue(options: FluentVueOptions): FluentVue {
  const bundles = shallowRef(options.bundles)

  const resolvedOptions = resolveOptions(options)

  const rootContext = new TranslationContext(bundles, resolvedOptions)

  return {
    get bundles() {
      return bundles.value
    },
    set bundles(value) {
      bundles.value = value
    },

    format: rootContext.format.bind(rootContext),
    formatAttrs: rootContext.formatAttrs.bind(rootContext),
    formatWithAttrs: rootContext.formatWithAttrs.bind(rootContext),

    install(vue) {
      if (isVue3) {
        const vue3 = vue as Vue3

        vue3.provide(RootContextSymbol, rootContext)

        vue3.config.globalProperties.$t = function (
          key: string,
          value?: Record<string, FluentVariable>,
        ) {
          return getContext(rootContext, this as Vue3Component).format(key, value)
        }
        vue3.config.globalProperties.$ta = function (
          key: string,
          value?: Record<string, FluentVariable>,
        ) {
          return getContext(rootContext, this as Vue3Component).formatAttrs(key, value)
        }

        vue3.directive('t', createVue3Directive(rootContext))
      }
      else {
        const vue2 = vue as Vue2

        vue2.mixin({
          provide() {
            return {
              [RootContextSymbol as symbol]: rootContext,
            }
          },
        })

        vue2.prototype.$t = function (key: string, value?: Record<string, FluentVariable>) {
          return getContext(rootContext, this).format(key, value)
        }
        vue2.prototype.$ta = function (key: string, value?: Record<string, FluentVariable>) {
          return getContext(rootContext, this).formatAttrs(key, value)
        }

        vue2.directive('t', createVue2Directive(rootContext))
      }

      (vue as Vue).component('i18n', component)
    },
  }
}
