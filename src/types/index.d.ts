import type { FluentBundle } from '@fluent/bundle'

type SimpleNode = Pick<Node, 'nodeType' | 'textContent' | 'nodeValue'>

export interface FluentVueOptions {
  /** Current negotiated fallback chain of languages */
  bundles: Iterable<FluentBundle>

  /** Custom function for warning about missing translation */
  warnMissing?: ((key: string) => void) | boolean

  /** Custom function for parsing markup */
  parseMarkup?: (markup: string) => SimpleNode[],

  /** Override the names of the global functions and directive to avoid conflicts */
  globals?: {
    functions?: {
      format?: string
      formatAttrs?: string
    },
    component?: string
    directive?: string
  }

  /**
   * Tag name for the component.
   * Set to `false` to disable wrapping the translation in a tag.
   * @default 'span'
   */
  tag?: string | false
}

export interface TranslationContextOptions {
  warnMissing: (key: string) => void
  parseMarkup: (markup: string) => SimpleNode[]
}

export interface ResolvedOptions extends TranslationContextOptions {
  globalFormatName: string
  globalFormatAttrsName: string
  directiveName: string
  componentName: string
  tag: string | false
}
