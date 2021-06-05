// @ts-disable
import Vue from 'vue'
// @ts-disable
import '@vue/runtime-core'
import { FluentResource } from '@fluent/bundle'

// #region Vue 2
declare module 'vue/types/vue' {
  interface Vue {
    $t: (key: string, values?: Record<string, unknown>) => string
    $ta: (key: string, values?: Record<string, unknown>) => Record<string, string>
  }
}

declare module 'vue/types/options' {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface ComponentOptions<V extends Vue> {
    /**
     * Message override for Vue component
     */
    fluent?: { [locale: string]: FluentResource }
  }
}
// #endregion

// #region Vue 3
declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $t: (key: string, values?: Record<string, unknown>) => string
    $ta: (key: string, values?: Record<string, unknown>) => Record<string, string>
  }
}

declare module '@vue/runtime-core' {
  interface ComponentCustomOptions {
    fluent?: { [locale: string]: FluentResource }
  }
}
// #endregion

export * from './dist/fluent-vue'
