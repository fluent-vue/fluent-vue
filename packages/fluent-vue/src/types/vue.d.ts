import type { FluentResource } from '@fluent/bundle'
import type { TranslationContext } from '../TranslationContext'

declare module 'vue' {
  interface ComponentCustomOptions {
    fluent?: Record<string, FluentResource>

    /** @private */
    _fluent?: TranslationContext
  }
}
