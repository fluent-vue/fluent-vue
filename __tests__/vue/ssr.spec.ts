import type { FluentVue } from '../../src'
import { FluentBundle, FluentResource } from '@fluent/bundle'

import ftl from '@fluent/dedent'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { isVue3 } from 'vue-demi'

import { createFluentVue } from '../../src'
import { renderSSR } from '../utils/ssr'

describe.skipIf(!isVue3)('ssr directive', () => {
  let fluent: FluentVue
  let bundle: FluentBundle

  beforeEach(() => {
    bundle = new FluentBundle('en-US')

    fluent = createFluentVue({
      bundles: [bundle],
    })
  })

  it('translates text content', async () => {
    // Arrange
    bundle.addResource(
      new FluentResource(ftl`
      link = Link text
        .aria-label = Link aria label
      `),
    )

    const component = {
      data: () => ({
        name: 'John',
      }),
      template: '<a v-t:link href="/foo"></a>',
    }

    // Act
    const rendered = await renderSSR(fluent, component)

    // Assert
    expect(rendered).toEqual('<a href="/foo" aria-label="Link aria label">Link text</a>')
  })

  it('warns when missing translation key', async () => {
    // Arrange
    const warnSpy = vi.spyOn(console, 'warn')

    const component = {
      template: '<a v-t href="/foo"></a>',
    }

    // Act
    const rendered = await renderSSR(fluent, component)

    // Assert
    expect(rendered).toEqual('<a href="/foo"></a>')
    expect(warnSpy).toHaveBeenCalledWith('[fluent-vue] v-t directive is missing arg with translation key')
  })

  it('only allows certain attributes', async () => {
    // Arrange
    bundle.addResource(
      new FluentResource(ftl`
      message = Hello, { $name }!
        .aria-label = Link aria label
        .href = Link href
      `),
    )

    const component = {
      data: () => ({
        name: 'John',
      }),
      template: '<a v-t:message="{ name }"></a>',
    }

    // Act
    const rendered = await renderSSR(fluent, component)

    // Assert
    expect(rendered).toEqual('<a aria-label="Link aria label" href="Link href">Hello, \u{2068}John\u{2069}!</a>')
  })
})
