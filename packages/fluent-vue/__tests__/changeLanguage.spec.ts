/**
 * @jest-environment jsdom
 */

import { nextTick } from 'vue-demi'
import { FluentBundle, FluentResource } from '@fluent/bundle'
import ftl from '@fluent/dedent'

import { mountWithFluent } from './utils'

import { createFluentVue, FluentVue } from '../src'

describe('language change', () => {
  let fluent: FluentVue
  let bundleEn: FluentBundle
  let bundleUk: FluentBundle

  beforeEach(() => {
    bundleEn = new FluentBundle('en-US')
    bundleUk = new FluentBundle('uk-UA')

    fluent = createFluentVue({
      bundles: [bundleUk, bundleEn]
    })
  })

  it('can work with multiple bundles', () => {
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
      template: '<a v-t:link href="/foo">Fallback text</a>'
    }

    // Act
    const mounted = mountWithFluent(fluent, component)

    // Assert
    expect(mounted.html()).toEqual('<a href="/foo">текст посилання</a>')
  })

  it('falls back to previous bundle', () => {
    // Arrange
    bundleEn.addResource(
      new FluentResource(ftl`
      link = link text
      `)
    )

    const component = {
      template: '<a v-t:link href="/foo">Fallback text</a>'
    }

    // Act
    const mounted = mountWithFluent(fluent, component)

    // Assert
    expect(mounted.html()).toEqual('<a href="/foo">link text</a>')
  })

  it('updates when changing current locale', async () => {
    // Arrange
    bundleEn = new FluentBundle('en-US')
    bundleUk = new FluentBundle('uk-UA')

    const fluent = createFluentVue({
      bundles: [bundleUk]
    })

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
      template: '<a v-t:link href="/foo">Fallback text</a>'
    }

    // Act
    const mounted = mountWithFluent(fluent, component)

    expect(mounted.html()).toEqual('<a href="/foo">текст посилання</a>')

    fluent.bundles = [bundleEn]

    await nextTick()

    // Assert
    expect(mounted.html()).toEqual('<a href="/foo">link text</a>')
  })

  it('works when dynamically adding bundles', async () => {
    // Arrange
    bundleEn = new FluentBundle('en-US')

    const fluent = createFluentVue({
      bundles: [bundleEn]
    })

    bundleEn.addResource(
      new FluentResource(ftl`
      link = link text
      `)
    )

    bundleUk = new FluentBundle('uk-UA')
    bundleUk.addResource(
      new FluentResource(ftl`
      link = текст посилання
      `)
    )

    const component = {
      template: '<a v-t:link href="/foo">Fallback text</a>'
    }

    const mounted = mountWithFluent(fluent, component)
    expect(mounted.html()).toEqual('<a href="/foo">link text</a>')

    // Act
    fluent.bundles = [bundleUk]

    await nextTick()

    // Assert
    expect(mounted.html()).toEqual('<a href="/foo">текст посилання</a>')
  })

  it('updates child components with overrides', async () => {
    // Arrange
    bundleEn = new FluentBundle('en-US')
    bundleUk = new FluentBundle('uk-UA')

    const fluent = createFluentVue({
      bundles: [bundleUk, bundleEn]
    })

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

    const child = {
      template: '<span>{{ $t(\'child\') }}</span>',
      fluent: {
        'uk-UA': new FluentResource(ftl`
        child = Повідомлення
        `),
        'en-US': new FluentResource(ftl`
        child = Child message
        `)
      }
    }
    const component = {
      components: {
        child
      },
      template: '<div><span>{{ $t(\'link\') }}</span><child /></div>'
    }

    // Act
    const mounted = mountWithFluent(fluent, component)

    expect(mounted.html()).toEqual(
      '<div><span>текст посилання</span><span>Повідомлення</span></div>'
    )

    fluent.bundles = [bundleEn]

    await nextTick()

    // Assert
    expect(mounted.html()).toEqual('<div><span>link text</span><span>Child message</span></div>')
  })
})
