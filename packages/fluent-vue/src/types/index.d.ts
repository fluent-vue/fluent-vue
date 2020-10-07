import { FluentResource } from '@fluent/bundle'
import { TranslationContext } from '../TranslationContext'

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
  interface ComponentOptions<V extends Vue> {
    /**
     * Message override for Vue component
     */
    fluent?: Record<string, FluentResource>
  }
}

declare module '*.ftl' {
  export default String
}
