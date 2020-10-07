import { isVue3, ref, provide, Ref } from 'vue-demi'
import { TranslationContext } from './TranslationContext'
import { createVue2Directive, createVue3Directive } from './vue/directive'
import component from './vue/component'
import { getContext } from './composition'
import { RootContextSymbol } from './symbols'
import { FluentBundle, FluentVariable } from '@fluent/bundle'

export { useFluent } from './composition'

export interface FluentVueOptions {
  /** Currently selected locale */
  locale: string | string[]
  /** List of bundles used in application */
  bundles: FluentBundle[]
}

/**
 * Creates FluentVue instance that can bu used on a Vue app.
 *
 * @param options - {@link FluentVueOptions}
 */
export function createFluentVue(options: FluentVueOptions) {
  const locale = ref(options.locale)
  const bundles: Ref<FluentBundle[]> = ref(options.bundles)

  const rootContext = new TranslationContext(locale, bundles)

  return {
    get locale() {
      return locale.value
    },
    set locale(value) {
      locale.value = value
    },

    get bundles() {
      return bundles.value
    },
    set bundles(value) {
      bundles.value = value
    },

    format: rootContext.format.bind(rootContext),
    formatAttrs: rootContext.formatAttrs.bind(rootContext),

    install(vue: any) {
      if (isVue3) {
        vue.provide(RootContextSymbol, rootContext)

        vue.config.globalProperties.$t = function (
          key: string,
          value?: Record<string, FluentVariable>
        ) {
          return getContext(rootContext, this).format(key, value)
        }
        vue.config.globalProperties.$ta = function (
          key: string,
          value?: Record<string, FluentVariable>
        ) {
          return getContext(rootContext, this).formatAttrs(key, value)
        }

        vue.directive('t', createVue3Directive(rootContext))
      } else {
        vue.mixin({
          setup() {
            provide(RootContextSymbol, rootContext)
          },
        })

        vue.prototype.$t = function (key: string, value?: Record<string, FluentVariable>) {
          return getContext(rootContext, this).format(key, value)
        }
        vue.prototype.$ta = function (key: string, value?: Record<string, FluentVariable>) {
          return getContext(rootContext, this).formatAttrs(key, value)
        }

        vue.directive('t', createVue2Directive(rootContext))
      }

      vue.component('i18n', component)
    },
  }
}
