import FluentVue from '../fluent-vue'

declare module 'vue/types/vue' {
  interface Vue {
    $fluent?: FluentVue
    _fluent?: FluentVue
  }
}
