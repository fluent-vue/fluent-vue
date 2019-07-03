import { Vue } from 'vue/types/vue'

interface FluentVueOptions {}

export default class FluentVue {
  private options: FluentVueOptions

  constructor(options: FluentVueOptions) {
    this.options = options
  }

  static install(vue: typeof Vue) {}
}
