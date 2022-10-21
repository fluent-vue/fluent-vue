import type { VueWrapper } from '@vue/test-utils'
import type { ComponentOptions, ComponentPublicInstance } from 'vue-3'
import { install, isVue3 } from 'vue-demi'

import type { FluentVue } from '../../src'

install()

export function mountWithFluent<T>(
  fluent: FluentVue | null,
  component: ComponentOptions<T>,
): VueWrapper<ComponentPublicInstance<T>> {
  if (isVue3) {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { mount } = require('@vue/test-utils')

    const plugins = fluent ? [fluent] : []

    return mount(component, {
      global: {
        plugins,
      },
    })
  }
  else {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { createLocalVue, mount } = require('@vue/test-utils')

    const localVue = createLocalVue()
    if (fluent)
      localVue.use(fluent)
    return mount(component, {
      localVue,
    })
  }
}
