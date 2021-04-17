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
