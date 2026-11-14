import type { FluentBundle, FluentVariable } from '@fluent/bundle'
import type { Message, Pattern } from '@fluent/bundle/esm/ast'
import type { Ref } from 'vue-demi'
import type { CustomVariableTypes } from './'
import type { TranslationContextOptions } from './types'
import { mapBundleSync } from '@fluent/sequence'

import { warn } from './util/warn'

export interface TranslationWithAttrs {
  value: string
  hasValue: boolean
  attributes: Record<string, string>
}

export class TranslationContext {
  bundles: Ref<Iterable<FluentBundle>>

  constructor(bundles: Ref<Iterable<FluentBundle>>, public options: TranslationContextOptions) {
    this.bundles = bundles
  }

  getBundle(key: string): FluentBundle | null {
    return mapBundleSync(this.bundles.value, key)
  }

  getMessage(bundle: FluentBundle | null, key: string): Message | null {
    const message = bundle?.getMessage(key)

    if (message === undefined) {
      this.options.warnMissing(key)
      return null
    }

    return message
  }

  formatPattern(
    bundle: FluentBundle,
    key: string,
    message: Pattern,
    value?: Record<string, FluentVariable | CustomVariableTypes>,
  ): string {
    const errors: Error[] = []

    const args = this.mapArgs(value)
    const formatted = bundle.formatPattern(message, args, errors)

    for (const error of errors)
      warn(`Error when formatting message with key [${key}]`, error)

    return formatted
  }

  private mapArgs(
    value?: Record<string, FluentVariable | CustomVariableTypes>,
  ): Record<string, FluentVariable> | undefined {
    if (value == null)
      return value

    const mapVariable = this.options.mapVariable
    if (mapVariable == null)
      return value

    const mappedValue: Record<string, FluentVariable> = {}
    for (const [name, variable] of Object.entries(value)) {
      mappedValue[name] = mapVariable(variable) ?? variable
    }

    return mappedValue
  }

  private _format(
    context: FluentBundle | null,
    message: Message | null,
    value?: Record<string, FluentVariable | CustomVariableTypes>,
  ): string | null {
    if (context === null || message === null || message.value === null)
      return null

    return this.formatPattern(context, message.id, message.value, value)
  }

  format = (key: string, value?: Record<string, FluentVariable | CustomVariableTypes>): string => {
    const context = this.getBundle(key)
    const message = this.getMessage(context, key)
    return this._format(context, message, value) ?? key
  }

  private _formatAttrs(
    context: FluentBundle | null,
    message: Message | null,
    value?: Record<string, FluentVariable | CustomVariableTypes>,
  ): Record<string, string> | null {
    if (context === null || message === null)
      return null

    const result: Record<string, string> = {}
    for (const [attrName, attrValue] of Object.entries(message.attributes))
      result[attrName] = this.formatPattern(context, message.id, attrValue, value)

    return result
  }

  formatAttrs = (key: string, value?: Record<string, FluentVariable | CustomVariableTypes>): Record<string, string> => {
    const context = this.getBundle(key)
    const message = this.getMessage(context, key)
    return this._formatAttrs(context, message, value) ?? {}
  }

  formatWithAttrs = (key: string, value?: Record<string, FluentVariable | CustomVariableTypes>): TranslationWithAttrs => {
    const context = this.getBundle(key)
    const message = this.getMessage(context, key)

    const formatValue = this._format(context, message, value)

    return {
      value: formatValue ?? key,
      attributes: this._formatAttrs(context, message, value) ?? {},
      hasValue: formatValue !== null,
    }
  }

  $t: (key: string, value?: Record<string, FluentVariable | CustomVariableTypes>) => string = this.format
  $ta: (key: string, value?: Record<string, FluentVariable | CustomVariableTypes>) => Record<string, string> = this.formatAttrs
}
