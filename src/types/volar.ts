import type { DefineComponent, FunctionDirective, PropType } from 'vue-demi'
import type { FluentVariable } from '@fluent/bundle'

type ComponentType = DefineComponent<{
  /**
   * The key of the translation.
   */
  path: {
    type: StringConstructor
    required: true
  }
  /**
   * Arguments to pass to the translation.
   */
  args: {
    type: PropType<Record<string, FluentVariable>>
    default: () => Record<string, FluentVariable>
  }
  /**
   * The tag to use as a root element.
   */
  tag: {
    type: StringConstructor
    default: 'span'
  }
  /**
   * Whether to render translation as html.
   */
  html: {
    type: BooleanConstructor
    default: false
  }
  /**
   * Whether to render translation without a root element.
   */
  noTag: {
    type: BooleanConstructor
    default: false
  }
}>

// eslint-disable-next-line @typescript-eslint/prefer-ts-expect-error
// @ts-ignore: works on Vue 2, fails in Vue 3
declare module 'vue/types/vue' {
  export interface Vue {
    $t: (key: string, values?: Record<string, unknown>) => string
    $ta: (key: string, values?: Record<string, unknown>) => Record<string, string>
  }
}

// eslint-disable-next-line @typescript-eslint/prefer-ts-expect-error
// @ts-ignore: works on Vue 3, fails in Vue 2
declare module '@vue/runtime-core' {
  export interface ComponentCustomProperties {
    $t: (key: string, values?: Record<string, unknown>) => string
    $ta: (key: string, values?: Record<string, unknown>) => Record<string, string>
    vT: FunctionDirective<HTMLElement, Record<string, FluentVariable>>
  }

  export interface GlobalComponents {
    i18n: ComponentType
  }
}
