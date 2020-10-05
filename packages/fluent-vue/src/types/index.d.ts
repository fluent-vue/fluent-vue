import { FluentResource } from '@fluent/bundle'
import { TranslationContext } from '../TranslationContext'
export { createFluentVue } from '../fluentVue'

declare module 'vue/types/vue' {
  interface Vue {
    /** @private */
    _fluent?: TranslationContext

    $fluent: TranslationContext

    $t(key: string, values?: Record<string, unknown>): string
    $ta(key: string, values?: Record<string, unknown>): Record<string, string>
  }
}

declare module 'vue/types/options' {
  interface ComponentOptions {
    /**
     * Message override for Vue component from fluent-loader
     *
     * @private
     */
    fluent?: Record<string, FluentResource>
  }
}

declare module '*.ftl' {
  export default String
}
