import { FluentVueOptions } from '../types'
import { Vue, VueConstructor } from 'vue/types/vue'
import { warn } from './util/warn'

export default class FluentVue {
  private options: FluentVueOptions
  static install: (vue: VueConstructor<Vue>) => void

  constructor(options: FluentVueOptions) {
    this.options = options
  }

  format(key: string, value?: object): string {
    const message = this.options.bundle.getMessage(key)

    if (message == null || message.value == null) {
      warn(false, `Could not find translation for key [${key}]`)
      return key
    }

    return this.options.bundle.formatPattern(message.value, value)
  }
}
