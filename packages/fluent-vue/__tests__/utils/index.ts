import { install, isVue3 } from 'vue-demi'

import { FluentVue } from '../../src'

install()

export function mountWithFluent(fluent: FluentVue, component: any) {
  if (isVue3) {
    const { mount } = require('@vue/test-utils')

    return mount(component, {
      global: {
        plugins: [fluent],
      },
    })
  } else {
    const { createLocalVue, mount } = require('@vue/test-utils')

    const localVue = createLocalVue()
    localVue.use(fluent)
    return mount(component, {
      localVue,
    })
  }
}
