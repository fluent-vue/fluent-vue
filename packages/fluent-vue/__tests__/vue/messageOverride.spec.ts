/**
 * @jest-environment jsdom
 */

import { nextTick } from 'vue-demi'
import { FluentBundle, FluentResource } from '@fluent/bundle'
import ftl from '@fluent/dedent'

import { mountWithFluent } from '../utils'

import { createFluentVue, FluentVue } from '../../src'

describe('message override', () => {
  let fluent: FluentVue
  let bundleEn: FluentBundle
  let bundleUk: FluentBundle

  beforeEach(() => {
    bundleEn = new FluentBundle(['en', 'en-US'])
    bundleUk = new FluentBundle(['uk', 'uk-UA'])

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

    fluent = createFluentVue({
      locale: ['uk-UA', 'en'],
      bundles: [bundleUk, bundleEn]
    })
  })

  it('can override one locale from a bundle with multiple locales', async () => {
    // Arrange
    const component = {
      template: '<a v-t:link href="/foo">Fallback text</a>',
      fluent: {
        uk: new FluentResource(ftl`
        link = текст посилання 2
        `)
      }
    }

    // Act
    const mounted = mountWithFluent(fluent, component)
    expect(mounted.html()).toEqual('<a href="/foo">текст посилання</a>')

    fluent.locale = 'uk'

    await nextTick()

    // Assert
    expect(mounted.html()).toEqual('<a href="/foo">текст посилання 2</a>')
  })

  it('warns when trying to override wrong locale', () => {
    // Arrange
    const component = {
      template: '<a v-t:link href="/foo">Fallback text</a>',
      fluent: {
        da: new FluentResource(ftl`
        link = linktekst
        `)
      }
    }

    const warn = jest.spyOn(console, 'warn').mockImplementation()

    // Act
    mountWithFluent(fluent, component)

    // Assert
    expect(warn).toHaveBeenCalledTimes(1)
    expect(warn).toHaveBeenCalledWith('[fluent-vue] Component [no-name] overides translations for locale "da" that is not in your bundles')

    // Cleanup
    warn.mockRestore()
  })
})
