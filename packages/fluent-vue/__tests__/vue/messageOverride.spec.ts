import { createLocalVue, mount } from '@vue/test-utils'

import { FluentBundle, FluentResource } from '@fluent/bundle'
import ftl from '@fluent/dedent'

import FluentVue from '../../src'

describe('message override', () => {
  let options: any
  let bundleEn: FluentBundle
  let bundleUk: FluentBundle

  beforeEach(() => {
    const localVue = createLocalVue()
    localVue.use(FluentVue)

    bundleEn = new FluentBundle(['en', 'en-US'])
    bundleUk = new FluentBundle(['uk', 'uk-UA'])

    const fluent = new FluentVue({
      locale: ['uk-UA', 'en'],
      bundles: [bundleUk, bundleEn],
    })

    options = {
      fluent,
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
      __fluent: {
        uk: new FluentResource(ftl`
        link = текст посилання 2
        `),
      },
    }

    // Act
    const mounted = mount(component, options)
    expect(mounted.html()).toEqual(`<a href="/foo">текст посилання</a>`)

    options.fluent.locale = 'uk'

    // Assert
    expect(mounted.html()).toEqual(`<a href="/foo">текст посилання</a>`)
  })
})
