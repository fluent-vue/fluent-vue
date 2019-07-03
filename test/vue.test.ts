import { createLocalVue, shallowMount } from '@vue/test-utils'

import { FluentBundle, ftl } from 'fluent'

// @ts-ignore
import App from './components/App.vue'

import FluentVue from '../src/fluent-vue'

const bundle = new FluentBundle('en-US', {
  useIsolating: false
})

bundle.addMessages(ftl`
  message = Hello, { $name }!
`)

const fluent = new FluentVue({
  // locale: mainLocale,
  // fallbackLocale: getFallbackLocale(mainLocale),
  bundle
})

const localVue = createLocalVue()
localVue.use(FluentVue)

describe('vue integration', () => {
  it('works', () => {
    // Act
    const mounted = shallowMount(App, {
      localVue,
      fluent
    } as any)

    // Assert
    console.log(mounted)
  })
})
