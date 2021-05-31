// @ts-ignore
import Vue from 'vue'
// @ts-ignore
import '@vue/runtime-core'
import { FluentResource } from '@fluent/bundle'

// #region Vue 2
declare module 'vue/types/vue' {
  interface Vue {
    $t(key: string, values?: Record<string, unknown>): string
    $ta(key: string, values?: Record<string, unknown>): Record<string, string>
  }
}

declare module 'vue/types/options' {
  // @ts-ignore
  interface ComponentOptions<V extends Vue> {
    /**
     * Message override for Vue component
     */
    fluent?: Record<string, FluentResource>
  }
}
// #endregion

// #region Vue 3
declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $t(key: string, values?: Record<string, unknown>): string
    $ta(key: string, values?: Record<string, unknown>): Record<string, string>
  }
}
// #endregion

export * from './dist/fluent-vue'
