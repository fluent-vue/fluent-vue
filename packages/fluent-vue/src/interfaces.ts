import Vue, { VueConstructor } from 'vue/types/umd'
import { FluentBundle } from '@fluent/bundle'

export interface FluentVue {
  locale: string | string[]
  bundles: FluentBundle[]

  install(vue: VueConstructor<Vue>): void
}

export interface FluentVueOptions {
  /** Currently selected locale */
  locale: string | string[]
  /** List of bundles used in application */
  bundles: FluentBundle[]
}
