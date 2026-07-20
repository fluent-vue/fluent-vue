import type { ComponentOptions } from 'vue'
import type { FluentVue } from '../../src'
import * as TestUtils from '@vue/test-utils'

export function mountWithFluent<T extends object>(
  fluent: FluentVue | null,
  component: ComponentOptions<T>,
) {
  const { mount } = TestUtils

  const plugins = fluent ? [fluent] : []

  return mount(component, {
    global: {
      plugins,
    },
  })
}
