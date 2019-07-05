import { createLocalVue, shallowMount, mount } from '@vue/test-utils'

import { FluentBundle, ftl } from 'fluent'

// @ts-ignore
import App from './components/App.vue'

import FluentVue from '../src'

const localVue = createLocalVue()
localVue.use(FluentVue)

const bundle = new FluentBundle('en-US', {
  useIsolating: false
})

bundle.addMessages(ftl`
  message = Hello, { $name }!
  sub-message = Hi, { $name }
`)

const fluent = new FluentVue({
  // locale: mainLocale,
  // fallbackLocale: getFallbackLocale(mainLocale),
  bundle
})

describe('vue integration', () => {
  it('translates messages in a component', () => {
    // Act
    const mounted = shallowMount(App, {
      localVue,
      fluent
    } as any)

    // Assert
    expect(mounted).toMatchSnapshot()
  })

  it('translates messages in sub-component', () => {
    // Act
    const mounted = mount(App, {
      localVue,
      fluent
    } as any)

    // Assert
    expect(mounted).toMatchSnapshot()
  })

  it('clears instance on component destroy', () => {
    // Arrange
    const mounted = shallowMount(App, {
      localVue,
      fluent
    } as any)

    // Act
    mounted.destroy()

    // Assert
    expect(mounted.vm.$fluent).not.toBeUndefined()

    localVue.nextTick(() => {
      expect(mounted.vm.$fluent).toBeUndefined()
    })
  })
})
