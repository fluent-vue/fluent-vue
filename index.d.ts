import { PropType, DefineComponent, FunctionDirective } from 'vue-demi'
import { FluentVariable } from '@fluent/bundle'

type ComponentType = DefineComponent<{
  /**
   * The key of the translation.
   */
  path: {
    type: StringConstructor,
    required: true,
  },
  /**
   * Arguments to pass to the translation.
   */
  args: {
    type: PropType<Record<string, FluentVariable>>,
    default: () => Record<string, FluentVariable>,
  },
  /**
   * The tag to use as a root element.
   */
  tag: {
    type: StringConstructor,
    default: 'span',
  },
  /**
   * Whether to render translation as html.
   */
  html: {
    type: BooleanConstructor,
    default: false,
  },
  /**
   * Whether to render translation without a root element.
   */
  noTag: {
    type: BooleanConstructor,
    default: false,
  }
}>

declare module 'vue' {
  interface ComponentCustomProperties {
    $t: (key: string, values?: Record<string, unknown>) => string
    $ta: (key: string, values?: Record<string, unknown>) => Record<string, string>
  }

  interface ComponentCustomProperties {
    vT: FunctionDirective<HTMLElement, Record<string, FluentVariable>>
  }

  interface GlobalComponents {
    i18n: ComponentType
  }
}

export * from './dist'
