import type {
  ObjectDirective as Vue2DirectiveOptions,
} from 'vue-2'
import type { Vue as Vue2Type } from 'vue-2/types/vue'
import type { DirectiveBinding as Vue2DirectiveBinding } from 'vue-2/types/options'
import type {
  ComponentPublicInstance as Vue3ComponentType,
  DirectiveBinding as Vue3DirectiveBinding,
  ObjectDirective as Vue3DirectiveOptions,
  App as Vue3Type,
} from 'vue-3'

export type Vue2Directive = Vue2DirectiveOptions
export type Vue3Directive = Vue3DirectiveOptions
export type VueDirective = Vue2DirectiveOptions | Vue3DirectiveOptions
export type VueDirectiveBinding = Vue2DirectiveBinding | Vue3DirectiveBinding

export type Vue3Component = Vue3ComponentType
export type Vue2Component = Vue2Type
export type VueComponent = Vue3Component | Vue2Component

export type Vue2 = typeof Vue2Type
export type Vue3 = Vue3Type
export type Vue = Vue3 | Vue2

export type InstallFunction = (vue: unknown) => void
