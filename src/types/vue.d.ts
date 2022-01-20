import type Vue from 'vue-2'
import type { FluentResource } from '@fluent/bundle'
import type { FluentVue } from '../index'

declare module 'vue-2/types/options' {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface ComponentOptions<V extends Vue> {
    fluent?: Record<string, FluentResource>

    /** @private */
    _fluent?: FluentVue

    /**
     * Setup function from @vue/composition-api
     * @private
     */
    setup?: () => void
  }
}

declare module '@vue/runtime-core' {
  interface ComponentCustomOptions {
    fluent?: Record<string, FluentResource>
  }
}
