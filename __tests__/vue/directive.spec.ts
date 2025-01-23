import type { FluentVue } from '../../src'

import { FluentBundle, FluentResource } from '@fluent/bundle'
import ftl from '@fluent/dedent'

import { beforeEach, describe, expect, it, vi } from 'vitest'

import { createFluentVue } from '../../src'
import { mountWithFluent } from '../utils'

describe('directive', () => {
  let fluent: FluentVue
  let bundle: FluentBundle

  beforeEach(() => {
    bundle = new FluentBundle('en-US')

    fluent = createFluentVue({
      bundles: [bundle],
    })
  })

  it('translates text content', () => {
    // Arrange
    bundle.addResource(
      new FluentResource(ftl`
      link = Link text
      `),
    )

    const component = {
      data: () => ({
        name: 'John',
      }),
      template: '<a v-t:link href="/foo">Fallback text</a>',
    }

    // Act
    const mounted = mountWithFluent(fluent, component)

    // Assert
    expect(mounted.html()).toEqual('<a href="/foo">Link text</a>')
  })

  it('warns about missing key arg', () => {
    // Arrange
    const component = {
      template: '<a v-t href="/foo">Fallback text</a>',
    }

    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})

    // Act
    const mounted = mountWithFluent(fluent, component)

    // Assert
    expect(mounted.html()).toEqual('<a href="/foo">Fallback text</a>')
    expect(warn).toHaveBeenCalledTimes(1)
    expect(warn).toHaveBeenCalledWith(
      '[fluent-vue] v-t directive is missing arg with translation key',
    )

    // Cleanup
    warn.mockRestore()
  })

  it('warns about missing translation', () => {
    // Arrange
    const component = {
      template: '<a v-t:missing-key href="/foo">Fallback text</a>',
    }

    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})

    // Act
    const mounted = mountWithFluent(fluent, component)

    // Assert
    expect(mounted.html()).toEqual('<a href="/foo">Fallback text</a>')
    expect(warn).toHaveBeenCalledTimes(1)
    expect(warn).toHaveBeenCalledWith(
      '[fluent-vue] Could not find translation for key [missing-key]',
    )

    // Cleanup
    warn.mockRestore()
  })

  it('can use parameters', () => {
    // Arrange
    bundle.addResource(
      new FluentResource(ftl`
      link = Hello {$name}
      `),
    )

    const component = {
      data: () => ({
        name: 'John',
      }),
      template: '<a v-t:link="{ name }" href="/foo">Fallback text</a>',
    }

    // Act
    const mounted = mountWithFluent(fluent, component)

    // Assert
    expect(mounted.html()).toEqual('<a href="/foo">Hello \u{2068}John\u{2069}</a>')
  })

  it('can translate DOM attributes', () => {
    // Arrange
    bundle.addResource(
      new FluentResource(ftl`
      link = Hello {$name}
        .aria-label = Localized aria
      `),
    )

    const component = {
      data: () => ({
        name: 'John',
      }),
      template: '<a v-t:link.aria-label="{ name }" href="/foo" aria-label="Fallback aria">Fallback text</a>',
    }

    // Act
    const mounted = mountWithFluent(fluent, component)

    // Assert
    expect(mounted.html()).toEqual('<a href="/foo" aria-label="Localized aria">Hello \u{2068}John\u{2069}</a>')
  })

  it('automatically binds whitelisted attrs', () => {
    // Arrange
    bundle.addResource(
      new FluentResource(ftl`
      link = Text
        .aria-label = Hello {$name}
        .not-allowed = Not allowed attrs value
      `),
    )

    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})

    const component = {
      data: () => ({
        name: 'John',
      }),
      template: '<a v-t:link="{ name }">Fallback</a>',
    }

    // Act
    const mounted = mountWithFluent(fluent, component)

    // Assert
    expect(mounted.html()).toEqual('<a aria-label="Hello \u{2068}John\u{2069}">Text</a>')
    expect(warn).toHaveBeenCalledTimes(1)
    expect(warn).toHaveBeenCalledWith(
      '[fluent-vue] Attribute \'not-allowed\' on element <a> is not localizable. Remove it from the translation. Translation key: link',
    )
  })

  it('works without fallbacks', () => {
    // Arrange
    bundle.addResource(
      new FluentResource(ftl`
      link = Hello {$name}
        .aria-label = Localized aria
      `),
    )

    const component = {
      data: () => ({
        name: 'John',
      }),
      template: '<a v-t:link.aria-label="{ name }"></a>',
    }

    // Act
    const mounted = mountWithFluent(fluent, component)

    // Assert
    expect(mounted.html()).toEqual('<a aria-label="Localized aria">Hello \u{2068}John\u{2069}</a>')
  })

  it('updates translations on component update', async () => {
    // Arrange
    bundle.addResource(
      new FluentResource(ftl`
      link = Hello {$name}
        .aria-label = Localized aria
      `),
    )

    const component = {
      data: () => ({
        name: 'John',
      }),
      template: '<a v-t:link.aria-label="{ name }"></a>',
    }

    const mounted = mountWithFluent(fluent, component)

    expect(mounted.html()).toEqual('<a aria-label="Localized aria">Hello \u{2068}John\u{2069}</a>')

    // Act
    await mounted.setData({ name: 'Anna' })

    // Assert
    expect(mounted.html()).toEqual('<a aria-label="Localized aria">Hello \u{2068}Anna\u{2069}</a>')
  })

  it('preserves translations on component update', async () => {
    // Arrange
    bundle.addResource(
      new FluentResource(ftl`
      link =
        .aria-label = Hello {$name}
      `),
    )

    const component = {
      data: () => ({
        name: 'John',
        otherName: 'Anna',
      }),
      template: '<a v-t:link.aria-label="{ name }">{{ otherName }}</a>',
    }

    const mounted = mountWithFluent(fluent, component)

    expect(mounted.html()).toEqual('<a aria-label="Hello \u{2068}John\u{2069}">Anna</a>')

    // Act
    await mounted.setData({ otherName: 'Test' })

    // Assert
    expect(mounted.html()).toEqual('<a aria-label="Hello \u{2068}John\u{2069}">Test</a>')
  })

  it('works with multiple attributes', () => {
    // Arrange
    bundle.addResource(
      new FluentResource(ftl`
      link = Text
        .aria-label = Hello {$name}
        .placeholder = Placeholder
      `),
    )

    const component = {
      data: () => ({
        name: 'John',
      }),
      template: '<a v-t:link.aria-label.placeholder="{ name }">Fallback</a>',
    }

    // Act
    const mounted = mountWithFluent(fluent, component)

    // Assert
    expect(mounted.html()).toEqual(
      '<a aria-label="Hello \u{2068}John\u{2069}" placeholder="Placeholder">Text</a>',
    )
  })
})
