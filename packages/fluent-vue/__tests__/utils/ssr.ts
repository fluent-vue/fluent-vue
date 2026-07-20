import type { ComponentOptions } from 'vue'
import type { FluentVue } from '../../src'
import * as TestUtils from '@vue/test-utils'

export function renderSSR<T extends object>(
  fluent: FluentVue | null,
  component: ComponentOptions<T>,
): Promise<string> {
  const { renderToString } = TestUtils

  const plugins = fluent ? [fluent] : []

  return renderToString(component, {
    global: {
      plugins,
    },
  })
}
