import { FluentResource } from '@fluent/bundle'
import { FluentBundle } from '@fluent/bundle'
import { FluentVariable } from '@fluent/bundle'

declare module 'vue/types/vue' {
  interface Vue {
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

/**
 * Creates FluentVue instance that can be used on a Vue app.
 *
 */
export declare function createFluentVue(options: FluentVueOptions): FluentVue

export declare interface FluentVue {
  /** Currently selected locale */
  locale: string | string[]
  /** List of bundles used in application */
  bundles: FluentBundle[]
  format(key: string, value?: Record<string, FluentVariable>): string
  formatAttrs(key: string, value?: Record<string, FluentVariable>): Record<string, string>
  formatWithAttrs: (
    key: string,
    value?: Record<string, FluentVariable> | undefined
  ) => TranslationWithAttrs
  install(vue: any): void
}

export declare interface FluentVueOptions {
  /** Currently selected locale */
  locale: string | string[]
  /** List of bundles used in application */
  bundles: FluentBundle[]
}

declare class TranslationContext {
  format: (key: string, value?: Record<string, FluentVariable> | undefined) => string
  formatAttrs: (
    key: string,
    value?: Record<string, FluentVariable> | undefined
  ) => Record<string, string>
  formatWithAttrs: (
    key: string,
    value?: Record<string, FluentVariable> | undefined
  ) => TranslationWithAttrs
  $t: (key: string, value?: Record<string, FluentVariable> | undefined) => string
  $ta: (key: string, value?: Record<string, FluentVariable> | undefined) => Record<string, string>
}

declare interface TranslationWithAttrs {
  value: string
  hasValue: boolean
  attributes: Record<string, string>
}

export declare function useFluent(): TranslationContext

export {}
