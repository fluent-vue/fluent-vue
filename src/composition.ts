import type { TranslationContext } from './TranslationContext'

import { getCurrentInstance, inject } from 'vue-demi'
import { assert } from './util/warn'
import { RootContextSymbol } from './symbols'
import { getContext } from './getContext'

export function useFluent (): TranslationContext {
  const instance = getCurrentInstance()
  assert(instance != null, 'useFluent called outside of setup')

  const rootContext = inject(RootContextSymbol)
  assert(rootContext != null, 'useFluent called without instaling plugin')

  return getContext(rootContext, instance.proxy)
}
