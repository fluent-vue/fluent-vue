import type { FluentBundle, FluentResource, FluentVariable } from '@fluent/bundle'
import type { App } from 'vue'
import type { TranslationWithAttrs } from './TranslationContext'

import type { FluentVueOptions } from './types'
import { getCurrentInstance, shallowRef } from 'vue'

import { registerFluentVueDevtools } from './devtools'
import { getContext, getMergedContext } from './getContext'
import { RootContextSymbol } from './symbols'
import { TranslationContext } from './TranslationContext'
import { resolveOptions } from './util/options'
import { createComponent } from './vue/component'
import { createDirective } from './vue/directive'
import './types/volar'

export { useFluent } from './composition'

/*
* Used for extending list of types that are supported by formatting functions.
* You still need to add `mapVariable` option to `createFluent` to support custom variable types.
*
* Add customVariableTypes property to this type.
*/
export interface TypesConfig { }

export type CustomVariableTypes
  = TypesConfig extends Record<'customVariableTypes', infer CustomVariables>
    ? CustomVariables
    : never

export type { FluentVueOptions }

export interface FluentVue {
  /** Current negotiated fallback chain of languages */
  bundles: Iterable<FluentBundle>

  format: (key: string, value?: Record<string, FluentVariable | CustomVariableTypes>) => string

  formatAttrs: (key: string, value?: Record<string, FluentVariable | CustomVariableTypes>) => Record<string, string>

  formatWithAttrs: (key: string, value?: Record<string, FluentVariable | CustomVariableTypes>) => TranslationWithAttrs

  mergedWith: (extraTranslations?: Record<string, FluentResource>) => TranslationContext

  $t: (key: string, value?: Record<string, FluentVariable | CustomVariableTypes>) => string
  $ta: (key: string, value?: Record<string, FluentVariable | CustomVariableTypes>) => Record<string, string>

  install: (vue: App) => void
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

    mergedWith: (extraTranslations?: Record<string, FluentResource>) => {
      return getMergedContext(rootContext, extraTranslations)
    },

    format: rootContext.format.bind(rootContext),
    formatAttrs: rootContext.formatAttrs.bind(rootContext),
    formatWithAttrs: rootContext.formatWithAttrs.bind(rootContext),

    $t: rootContext.format.bind(rootContext),
    $ta: rootContext.formatAttrs.bind(rootContext),

    install(vue) {
      // eslint-disable-next-line node/prefer-global/process
      if (process.env.NODE_ENV !== 'production')
        registerFluentVueDevtools(vue, resolvedOptions, this)

      vue.provide(RootContextSymbol, rootContext)

      vue.config.globalProperties[resolvedOptions.globalFormatName] = function (
        key: string,
        value?: Record<string, FluentVariable>,
      ) {
        const instance = getCurrentInstance()
        return getContext(rootContext, instance?.proxy).format(key, value)
      }
      vue.config.globalProperties[resolvedOptions.globalFormatAttrsName] = function (
        key: string,
        value?: Record<string, FluentVariable>,
      ) {
        const instance = getCurrentInstance()
        return getContext(rootContext, instance?.proxy).formatAttrs(key, value)
      }

      vue.directive(resolvedOptions.directiveName, createDirective(rootContext))

      vue.component(resolvedOptions.componentName, createComponent(resolvedOptions, rootContext))
    },
  }
}
