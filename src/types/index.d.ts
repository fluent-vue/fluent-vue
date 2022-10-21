import type { FluentBundle } from '@fluent/bundle'

type SimpleNode = Pick<Node, 'nodeType' | 'textContent' | 'nodeValue'>

export interface FluentVueOptions {
  /** Current negotiated fallback chain of languages */
  bundles: Iterable<FluentBundle>

  /** Custom function for warning about missing translation */
  warnMissing?: ((key: string) => void) | boolean

  /** Custom function for parsing markup */
  parseMarkup?: (markup: string) => SimpleNode[]
}

export interface TranslationContextOptions {
  warnMissing: (key: string) => void
  parseMarkup: (markup: string) => SimpleNode[]
}
