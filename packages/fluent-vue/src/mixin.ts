import { getCurrentInstance, provide } from 'vue-demi'
import { warn } from './util/warn'
import { TranslationContext } from './TranslationContext'
import { RootContextSymbol } from './symbols'
import { getContext } from './composition'

export function createMixin(rootContext: TranslationContext) {
  return {
    setup() {
      provide(RootContextSymbol, rootContext)

      const instance = getCurrentInstance()

      const context = getContext(rootContext, instance)
      if (context == null) {
        warn('cannot get context')
        return {}
      }

      return {
        $fluent: context,
        $t: context.format.bind(context),
        $ta: context.formatAttrs.bind(context),
      }
    },
  }
}
