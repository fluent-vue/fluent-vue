import { Vue } from 'vue/types/vue'
import { FluentBundle, MessageInfo, Pattern } from '@fluent/bundle'

export interface FluentVueObject {
  getBundle(key: string): FluentBundle | null
  getMessage(bundle: FluentBundle | null, key: string): MessageInfo | null
  formatPattern(bundle: FluentBundle, message: Pattern, value?: object, errors?: string[]): string
  format(key: string, value?: object): string

  subscribe(vue: Vue): void
  unsubscribe(vue: Vue): void
}

export interface FluentVueOptions {
  bundles: FluentBundle[]
}

declare module 'vue/types/vue' {
  interface Vue {
    $fluent: FluentVueObject
    $t(key: string, values: any): string
  }
}

declare module 'vue/types/options' {
  interface ComponentOptions<V extends Vue> {
    fluent?: FluentVueObject
  }
}

declare module '*.ftl' {
  export default String
}
