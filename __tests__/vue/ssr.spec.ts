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
      template: '<a v-t:link href="/foo">Fallback text</a>',
    }

    // Act
    const rendered = await renderSSR(fluent, component)

    // Assert
    // This has fallback text because the textContent is not supported by Vue getSSRProps
    // Text will be translated using directive transform
    expect(rendered).toEqual('<a href="/foo" aria-label="Link aria label">Fallback text</a>')
  })

  it('warns when missing translation key', async () => {
    // Arrange
    const warnSpy = vi.spyOn(console, 'warn')

    const component = {
      template: '<a v-t href="/foo">Fallback text</a>',
    }

    // Act
    const rendered = await renderSSR(fluent, component)

    // Assert
    expect(rendered).toEqual('<a href="/foo">Fallback text</a>')
    expect(warnSpy).toHaveBeenCalledWith('[fluent-vue] v-t directive is missing arg with translation key')
  })
})
