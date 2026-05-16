import type { VueWrapper } from '@vue/test-utils'
import type { ComponentOptions, ComponentPublicInstance } from 'vue-3'
import type { FluentVue } from '../../src'
import * as TestUtils from '@vue/test-utils'

import { install, isVue3 } from 'vue-demi'

install()

export function mountWithFluent<T extends object>(
  fluent: FluentVue | null,
  component: ComponentOptions<T>,
): VueWrapper<ComponentPublicInstance<T>> {
  if (isVue3) {
    const { mount } = TestUtils

    const plugins = fluent ? [fluent] : []

    return mount(component, {
      global: {
        plugins,
      },
    })
  }
  else {
    const { createLocalVue, mount } = TestUtils

    const localVue = createLocalVue()
    if (fluent)
      localVue.use(fluent)
    return mount(component, {
      localVue,
    })
  }
}
