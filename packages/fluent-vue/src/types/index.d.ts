import Vue, { PluginFunction } from 'vue'
import { FluentResource } from '@fluent/bundle'
import { FluentVueObject, FluentVueOptions } from '../interfaces'

declare module 'vue/types/vue' {
  interface Vue {
    /** @private */
    _fluent?: FluentVueObject

    $fluent: FluentVueObject

    $t(key: string, values?: Record<string, unknown>): string
    $ta(key: string, values?: Record<string, unknown>): Record<string, string>
  }
}

declare module 'vue/types/options' {
  interface ComponentOptions<V extends Vue> {
    fluent?: FluentVue

    __fluent?: Record<string, FluentResource>
  }
}

declare module '*.ftl' {
  export default String
}

declare class FluentVue {
  format(key: string, value?: object): string
  formatAttrs(key: string, value?: object): Record<string, string>

  constructor(options: FluentVueOptions)

  static install: PluginFunction<never>
}

export default FluentVue
