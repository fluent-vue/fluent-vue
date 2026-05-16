import type { FluentVariable } from '@fluent/bundle'
import type { DefineComponent, FunctionDirective, PropType } from 'vue-demi'

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
    type: PropType<string | false>
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

// eslint-disable-next-line ts/ban-ts-comment
// @ts-ignore: works on Vue 2, fails in Vue 3
declare module 'vue/types/vue' {
  export interface Vue {
    $t: (key: string, values?: Record<string, unknown>) => string
    $ta: (key: string, values?: Record<string, unknown>) => Record<string, string>
  }
}

// eslint-disable-next-line ts/ban-ts-comment
// @ts-ignore: works on Vue 3, fails in Vue 2
declare module 'vue' {
  export interface ComponentCustomProperties {
    $t: (key: string, values?: Record<string, unknown>) => string
    $ta: (key: string, values?: Record<string, unknown>) => Record<string, string>
    vT: FunctionDirective<HTMLElement, Record<string, FluentVariable>>
  }

  export interface GlobalComponents {
    i18n: ComponentType
  }
}
