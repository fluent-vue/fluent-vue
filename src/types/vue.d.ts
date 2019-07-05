import FluentVue from '../fluent-vue'
import Vue from 'vue'

declare module 'vue/types/vue' {
  interface Vue {
    $fluent?: FluentVue
    _fluent?: FluentVue
  }
}

declare module 'vue/types/options' {
  interface ComponentOptions<V extends Vue> {
    fluent?: FluentVue
  }
}
