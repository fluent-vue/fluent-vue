import type { FluentBundle, FluentVariable } from '@fluent/bundle'
import type { CustomVariableTypes } from 'src'

type SimpleNode = Pick<Node, 'nodeType' | 'textContent' | 'nodeValue'>

export interface FluentVueOptions {
  /** Current negotiated fallback chain of languages */
  bundles: Iterable<FluentBundle>

  /** Custom function for warning about missing translation */
  warnMissing?: ((key: string) => void) | boolean

  /** Custom function for parsing markup */
  parseMarkup?: (markup: string) => SimpleNode[]

  /** Override the names of the global functions and directive to avoid conflicts */
  globals?: {
    functions?: {
      format?: string
      formatAttrs?: string
    }
    component?: string
    directive?: string
  }

  /**
   * Tag name used in the `i18n` component.
   * Set to `false` to disable wrapping the translation in a tag.
   * @default 'span'
   */
  componentTag?: string | false

  /**
   * Function that converts a custom value to a FluentVariable.
   * This is useful for adding support for types that are not supported by fluent.js.
   */
  mapVariable?: (value: FluentVariable | CustomVariableTypes) => FluentVariable | undefined
}

export interface TranslationContextOptions {
  warnMissing: (key: string) => void
  parseMarkup: (markup: string) => SimpleNode[]
  mapVariable?: (value: FluentVariable | CustomVariableTypes) => FluentVariable | undefined
}

export interface ResolvedOptions extends TranslationContextOptions {
  globalFormatName: string
  globalFormatAttrsName: string
  directiveName: string
  componentName: string
  componentTag: string | false
}
