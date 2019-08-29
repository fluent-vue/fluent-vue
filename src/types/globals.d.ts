import { Vue } from 'vue/types/vue'
import { FluentVueObject } from '.'

declare module 'vue/types/vue' {
  interface Vue {
    _fluent?: FluentVueObject
  }
}
