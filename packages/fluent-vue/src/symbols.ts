import type { InjectionKey } from 'vue-demi'
import type { TranslationContext } from './TranslationContext'

export const RootContextSymbol: InjectionKey<TranslationContext> = Symbol('root-context')
