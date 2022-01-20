import type { VueWrapper } from '@vue/test-utils'
import type { ComponentOptions, ComponentPublicInstance } from 'vue-3'
import { install, isVue3 } from 'vue-demi'

import type { FluentVue } from '../../src'

install()

export function mountWithFluent<T>(
  fluent: FluentVue,
  component: ComponentOptions<T>,
): VueWrapper<ComponentPublicInstance<T>> {
  if (isVue3) {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { mount } = require('@vue/test-utils')

    return mount(component, {
      global: {
        plugins: [fluent],
      },
    })
  }
  else {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { createLocalVue, mount } = require('@vue/test-utils')

    const localVue = createLocalVue()
    localVue.use(fluent)
    return mount(component, {
      localVue,
    })
  }
}
