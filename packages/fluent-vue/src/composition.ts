import type { TranslationContext } from './TranslationContext'
import { getCurrentInstance, inject } from 'vue-demi'

import { getContext } from './getContext'
import { RootContextSymbol } from './symbols'
import { assert } from './util/warn'

export function useFluent(): TranslationContext {
  const instance = getCurrentInstance()
  assert(instance != null, 'useFluent called outside of setup')

  const rootContext = inject(RootContextSymbol, undefined)
  assert(rootContext != null, 'useFluent called without installing plugin')

  return getContext(rootContext, instance.proxy, true)
}
