import * as TestUtils from '@vue/test-utils'
import type { ComponentOptions } from 'vue-3'
import { install } from 'vue-demi'

import type { FluentVue } from '../../src'

install()

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
