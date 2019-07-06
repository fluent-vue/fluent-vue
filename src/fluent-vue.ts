import { FluentVueOptions } from '../types'
import { Vue, VueConstructor } from 'vue/types/vue'

export default class FluentVue {
  private options: FluentVueOptions
  static install: (vue: VueConstructor<Vue>) => void

  constructor(options: FluentVueOptions) {
    this.options = options
  }

  format(key: string, value?: object): string {
    const message = this.options.bundle.getMessage(key)

    return this.options.bundle.format(message, value)
  }
}
