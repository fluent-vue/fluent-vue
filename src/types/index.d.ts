import { Vue } from 'vue/types/vue'
import { FluentBundle, MessageInfo, Pattern } from '@fluent/bundle'

declare module 'vue/types/vue' {
  interface Vue {
    $fluent: FluentVueObject
    $t(key: string, values: Record<string, unknown>): string
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
