import Vue from 'vue'
import { createLocalVue, mount } from '@vue/test-utils'
import VueCompositionApi from '@vue/composition-api'

import { FluentBundle, FluentResource } from '@fluent/bundle'
import ftl from '@fluent/dedent'

import { createFluentVue, FluentVue } from '../../src'

Vue.use(VueCompositionApi)

describe('message override', () => {
  let options: any
  let fluent: FluentVue
  let bundleEn: FluentBundle
  let bundleUk: FluentBundle

  beforeEach(() => {
    const localVue = createLocalVue()

    bundleEn = new FluentBundle(['en', 'en-US'])
    bundleUk = new FluentBundle(['uk', 'uk-UA'])

    fluent = createFluentVue({
      locale: ['uk-UA', 'en'],
      bundles: [bundleUk, bundleEn],
    })
    localVue.use(fluent)

    options = {
      localVue,
    }
  })

  it('can override one locale from a bundle with multiple locales', () => {
    // Arrange
    bundleEn.addResource(
      new FluentResource(ftl`
      link = link text
      `)
    )

    bundleUk.addResource(
      new FluentResource(ftl`
      link = текст посилання
      `)
    )

    const component = {
      template: `<a v-t:link href="/foo">Fallback text</a>`,
      fluent: {
        uk: new FluentResource(ftl`
        link = текст посилання 2
        `),
      },
    }

    // Act
    const mounted = mount(component, options)
    expect(mounted.html()).toEqual(`<a href="/foo">текст посилання</a>`)

    fluent.locale = 'uk'

    // Assert
    expect(mounted.html()).toEqual(`<a href="/foo">текст посилання</a>`)
  })
})
