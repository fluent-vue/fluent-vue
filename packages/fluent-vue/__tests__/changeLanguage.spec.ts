import { install, nextTick } from 'vue-demi'
import { createLocalVue, mount } from '@vue/test-utils'

import { FluentBundle, FluentResource } from '@fluent/bundle'
import ftl from '@fluent/dedent'

import { createFluentVue } from '../src'

install()

describe('language change', () => {
  let options: any
  let bundleEn: FluentBundle
  let bundleUk: FluentBundle

  beforeEach(() => {
    const localVue = createLocalVue()

    bundleEn = new FluentBundle('en-US')
    bundleUk = new FluentBundle('uk-UA')

    const fluent = createFluentVue({
      locale: ['uk-UA', 'en-US'],
      bundles: [bundleUk, bundleEn],
    })

    localVue.use(fluent)

    options = {
      localVue,
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
      template: `<a v-t:link href="/foo">Fallback text</a>`,
    }

    // Act
    const mounted = mount(component, options)

    // Assert
    expect(mounted.html()).toEqual(`<a href="/foo">текст посилання</a>`)
  })

  it('falls back to previous bundle', () => {
    // Arrange
    bundleEn.addResource(
      new FluentResource(ftl`
      link = link text
      `)
    )

    const component = {
      template: `<a v-t:link href="/foo">Fallback text</a>`,
    }

    // Act
    const mounted = mount(component, options)

    // Assert
    expect(mounted.html()).toEqual(`<a href="/foo">link text</a>`)
  })

  it('updates when changing current locale', async () => {
    // Arrange
    const localVue = createLocalVue()

    bundleEn = new FluentBundle('en-US')
    bundleUk = new FluentBundle('uk-UA')

    const fluent = createFluentVue({
      locale: 'uk-UA',
      bundles: [bundleUk, bundleEn],
    })
    localVue.use(fluent)

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
    }

    // Act
    const mounted = mount(component, { localVue })

    expect(mounted.html()).toEqual(`<a href="/foo">текст посилання</a>`)

    fluent.locale = 'en'

    await nextTick()

    // Assert
    expect(mounted.html()).toEqual(`<a href="/foo">link text</a>`)
  })

  it('works when dynamically adding bundles', async () => {
    // Arrange
    const localVue = createLocalVue()

    bundleEn = new FluentBundle('en-US')

    const fluent = createFluentVue({
      locale: 'en-US',
      bundles: [bundleEn],
    })
    localVue.use(fluent)

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
      template: `<a v-t:link href="/foo">Fallback text</a>`,
    }

    const mounted = mount(component, { localVue })
    expect(mounted.html()).toEqual(`<a href="/foo">link text</a>`)

    // Act
    fluent.bundles = fluent.bundles.concat(bundleUk)
    fluent.locale = 'uk'

    await nextTick()

    // Assert
    expect(mounted.html()).toEqual(`<a href="/foo">текст посилання</a>`)
  })

  it('updates child components with overrides', async () => {
    // Arrange
    const localVue = createLocalVue()

    bundleEn = new FluentBundle('en-US')
    bundleUk = new FluentBundle('uk-UA')

    const fluent = createFluentVue({
      locale: 'uk-UA',
      bundles: [bundleUk, bundleEn],
    })
    localVue.use(fluent)

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
      template: `<span>{{ $t('child') }}</span>`,
      fluent: {
        'uk-UA': new FluentResource(ftl`
        child = Повідомлення
        `),
        'en-US': new FluentResource(ftl`
        child = Child message
        `),
      },
    }
    const component = {
      components: {
        child,
      },
      template: `<div><span>{{ $t('link') }}</span><child /></div>`,
    }

    // Act
    const mounted = mount(component, {
      localVue,
    })

    expect(mounted.html()).toEqual(
      `<div><span>текст посилання</span><span>Повідомлення</span></div>`
    )

    fluent.locale = 'en'

    await nextTick()

    // Assert
    expect(mounted.html()).toEqual(`<div><span>link text</span><span>Child message</span></div>`)
  })
})
