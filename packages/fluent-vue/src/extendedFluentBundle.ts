import { FluentBundle } from '@fluent/bundle'
import { Message } from '@fluent/bundle/esm/ast'

/**
 * Fluent bundle that inherits parent bundle messages and terms.
 *
 * Allows splitting localization into multiple bundles and share
 * common messages and terms betwean bundles.
 */
export class ExtendedFluentBundle extends FluentBundle {
  constructor(private parent: FluentBundle, locale: string | string[]) {
    super(locale, {
      functions: parent._functions,
      useIsolating: parent._useIsolating,
      transform: parent._transform,
    })
  }

  getMessage(id: string): Message | undefined {
    return this._messages.get(id) || this.parent.getMessage(id)
  }

  hasMessage(id: string): boolean {
    return this._messages.has(id) || this.parent.hasMessage(id)
  }
}
