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
    t?: string;
    ta?: string;
  }
}

export interface TranslationContextOptions {
  warnMissing: (key: string) => void
  parseMarkup: (markup: string) => SimpleNode[]
}
