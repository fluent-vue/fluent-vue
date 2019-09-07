import { createLocalVue, mount } from '@vue/test-utils'

import { FluentBundle, FluentResource } from '@fluent/bundle'
import ftl from '@fluent/dedent'

import FluentVue from '../src'

describe('language change', () => {
  let options: any
  let bundleEn: FluentBundle
  let bundleUk: FluentBundle

  beforeEach(() => {
    const localVue = createLocalVue()
    localVue.use(FluentVue)

    bundleEn = new FluentBundle('en-US')
    bundleUk = new FluentBundle('uk-UA')

    const fluent = new FluentVue({
      bundles: [bundleUk, bundleEn]
    })

    options = {
      fluent,
      localVue
    }
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
      template: `<a v-t:link href="/foo">Fallback text</a>`
    }

    // Act
    const mounted = mount(component, options)

    // Assert
    expect(mounted).toMatchSnapshot()
  })

  it('falls back to previous bundle', () => {
    // Arrange
    bundleEn.addResource(
      new FluentResource(ftl`
      link = link text
      `)
    )

    const component = {
      template: `<a v-t:link href="/foo">Fallback text</a>`
    }

    // Act
    const mounted = mount(component, options)

    // Assert
    expect(mounted).toMatchSnapshot()
  })

  it('updates when updating bundles array', () => {
    // Arrange
    const localVue = createLocalVue()
    localVue.use(FluentVue)

    bundleEn = new FluentBundle('en-US')
    bundleUk = new FluentBundle('uk-UA')

    const fluent = new FluentVue({
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

    const component = {
      template: `<a v-t:link href="/foo">Fallback text</a>`
    }

    // Act
    const mounted = mount(component, {
      fluent,
      localVue
    })

    expect(mounted).toMatchSnapshot()

    fluent.bundles = [bundleEn, bundleUk]

    // Assert
    expect(mounted).toMatchSnapshot()
  })
})
