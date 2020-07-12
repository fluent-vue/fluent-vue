import { FluentBundle } from '@fluent/bundle'

/**
 * Copies options, messages and terms from parent bundle.
 *
 * Allows splitting localization into multiple bundles and share
 * common messages and terms betwean bundles.
 */
export function inheritBundle(locale: string | string[], parent: FluentBundle): FluentBundle {
  // Copy options
  const bundle = new FluentBundle(locale, {
    functions: parent._functions,
    useIsolating: parent._useIsolating,
    transform: parent._transform,
  })

  // Copy messages and terms
  bundle._terms = new Map(parent._terms)
  bundle._messages = new Map(parent._messages)

  return bundle
}
