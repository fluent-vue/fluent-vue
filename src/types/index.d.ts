import Vue, { PluginFunction } from 'vue'
import { FluentBundle, MessageInfo, Pattern } from '@fluent/bundle'
import { FluentVueObject, FluentVueOptions, IUpdatable } from '../interfaces'

declare module 'vue/types/vue' {
  interface Vue {
    /** @private */
    _fluent?: FluentVueObject

    $fluent: FluentVueObject

    $t(key: string, values?: Record<string, unknown>): string
  }
}

declare module 'vue/types/options' {
  interface ComponentOptions<V extends Vue> {
    fluent?: FluentVue
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
