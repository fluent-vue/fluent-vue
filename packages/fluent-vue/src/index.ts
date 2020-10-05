import { isVue3, ref } from 'vue-demi'
import { FluentVueOptions } from './interfaces'
import { TranslationContext } from './TranslationContext'
import { createMixin } from './mixin'
import directive from './vue/directive'
import component from './vue/component'
import { getContext } from './composition'
import { RootContextSymbol } from './symbols'

export { useFluent } from './composition'

/**
 * Creates FluentVue instance that can bu used on a Vue app.
 *
 * @param options - {@link FluentVueOptions}
 */
export function createFluentVue(options: FluentVueOptions) {
  const locale = ref(options.locale)
  const bundles = ref(options.bundles)

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

        Object.defineProperty(vue.config.globalProperties, '$fluent', {
          get() {
            return getContext(rootContext, this)
          },
        })
        vue.config.globalProperties.$t = function () {
          const context = getContext(rootContext, this)
          return context.format.apply(context, arguments as any)
        }
        vue.config.globalProperties.$ta = function () {
          const context = getContext(rootContext, this)
          return context.formatAttrs.apply(context, arguments as any)
        }
      } else {
        vue.mixin(createMixin(rootContext))
      }

      vue.directive('t', directive)
      vue.component('i18n', component)
    },
  }
}
