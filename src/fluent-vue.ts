import { FluentVueObject, FluentVueOptions } from '../types'
import { Vue, VueConstructor } from 'vue/types/vue'
import { warn } from './util/warn'
import { Pattern } from '@fluent/bundle'

export default class FluentVue implements FluentVueObject {
  private options: FluentVueOptions
  static install: (vue: VueConstructor<Vue>) => void

  constructor(options: FluentVueOptions) {
    this.options = options
  }

  getMessage(key: string) {
    const message = this.options.bundle.getMessage(key)

    if (message === undefined) {
      warn(false, `Could not find translation for key [${key}]`)
      return undefined
    }

    return message
  }

  formatPattern(message: Pattern, value?: object, errors?: string[]): string {
    return this.options.bundle.formatPattern(message, value, errors)
  }

  format(key: string, value?: object): string {
    const message = this.getMessage(key)

    if (message === undefined || message.value === null) {
      return key
    }

    const errors: string[] = []
    const result = this.formatPattern(message.value, value, errors)
    for (const error of errors) {
      warn(false, `Fluent error for key [${key}]: ${error}`)
    }

    return result
  }
}
