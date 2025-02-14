import type { FluentBundle, FluentVariable } from '@fluent/bundle'
import type { Message, Pattern } from '@fluent/bundle/esm/ast'
import type { TypesConfig } from 'src'
import type { Ref } from 'vue-demi'
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
    value?: Record<string, FluentVariable | TypesConfig['customVariableTypes']>,
  ): string {
    const errors: Error[] = []

    const mappedValue = value
    if (mappedValue != null && this.options.mapVariable != null) {
      for (const [key, variable] of Object.entries(mappedValue)) {
        const mappedVariable = this.options.mapVariable(variable)
        if (mappedVariable != null)
          mappedValue[key] = mappedVariable
      }
    }

    const formatted = bundle.formatPattern(message, mappedValue, errors)

    for (const error of errors)
      warn(`Error when formatting message with key [${key}]`, error)

    return formatted
  }

  private _format(
    context: FluentBundle | null,
    message: Message | null,
    value?: Record<string, FluentVariable | TypesConfig['customVariableTypes']>,
  ): string | null {
    if (context === null || message === null || message.value === null)
      return null

    return this.formatPattern(context, message.id, message.value, value)
  }

  format = (key: string, value?: Record<string, FluentVariable | TypesConfig['customVariableTypes']>): string => {
    const context = this.getBundle(key)
    const message = this.getMessage(context, key)
    return this._format(context, message, value) ?? key
  }

  private _formatAttrs(
    context: FluentBundle | null,
    message: Message | null,
    value?: Record<string, FluentVariable | TypesConfig['customVariableTypes']>,
  ): Record<string, string> | null {
    if (context === null || message === null)
      return null

    const result: Record<string, string> = {}
    for (const [attrName, attrValue] of Object.entries(message.attributes))
      result[attrName] = this.formatPattern(context, message.id, attrValue, value)

    return result
  }

  formatAttrs = (key: string, value?: Record<string, FluentVariable | TypesConfig['customVariableTypes']>): Record<string, string> => {
    const context = this.getBundle(key)
    const message = this.getMessage(context, key)
    return this._formatAttrs(context, message, value) ?? {}
  }

  formatWithAttrs = (key: string, value?: Record<string, FluentVariable | TypesConfig['customVariableTypes']>): TranslationWithAttrs => {
    const context = this.getBundle(key)
    const message = this.getMessage(context, key)

    const formatValue = this._format(context, message, value)

    return {
      value: formatValue ?? key,
      attributes: this._formatAttrs(context, message, value) ?? {},
      hasValue: formatValue !== null,
    }
  }

  $t = this.format
  $ta = this.formatAttrs
}
