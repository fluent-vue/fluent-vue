import type Vue from 'vue-2'
import type { FluentResource } from '@fluent/bundle'
import type { TranslationContext } from '../TranslationContext'

declare module 'vue-2/types/options' {
  interface ComponentOptions<V extends Vue> {
    fluent?: Record<string, FluentResource>

    /** @private */
    _fluent?: TranslationContext

    /** @private */
    _fluentSetup?: TranslationContext
  }
}

declare module 'vue-3' {
  interface ComponentCustomOptions {
    fluent?: Record<string, FluentResource>
  }
}
