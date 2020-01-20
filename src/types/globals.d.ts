import { Vue } from 'vue/types/vue'
import { FluentBundle, MessageInfo, Pattern } from '@fluent/bundle'

declare module 'vue/types/vue' {
  interface Vue {
    _fluent?: FluentVueObject
  }
}

declare global {
  interface FluentVueObject {
    getBundle(key: string): FluentBundle | null
    getMessage(bundle: FluentBundle | null, key: string): MessageInfo | null
    formatPattern(bundle: FluentBundle, message: Pattern, value?: object, errors?: string[]): string
    format(key: string, value?: object): string

    subscribe(vue: Vue): void
    unsubscribe(vue: Vue): void
  }

  interface FluentVueOptions {
    bundles: FluentBundle[]
  }
}
