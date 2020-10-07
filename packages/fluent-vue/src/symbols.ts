import { InjectionKey } from 'vue-demi'
import { TranslationContext } from './TranslationContext'

export const RootContextSymbol: InjectionKey<TranslationContext> = Symbol('root-context')
