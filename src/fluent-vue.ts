import { Vue } from 'vue/types/vue'
import { FluentBundle } from 'fluent'

import extend from './extend'
import mixin from './mixin'

interface FluentVueOptions {
  bundle: FluentBundle
}

export default class FluentVue {
  private options: FluentVueOptions

  constructor(options: FluentVueOptions) {
    this.options = options
  }

  static install(vue: typeof Vue) {
    extend(vue)
    vue.mixin(mixin)
  }

  format(key: string, value?: object) {
    const message = this.options.bundle.getMessage(key)

    return this.options.bundle.format(message, value)
  }
}
