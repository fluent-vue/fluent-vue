import { beforeEach, describe, expect, it } from 'vitest'

import { FluentBundle, FluentResource } from '@fluent/bundle'
import ftl from '@fluent/dedent'

import { nextTick } from 'vue-demi'

import { mountWithFluent } from '../utils'
import type { FluentVue } from '../../src'
import { createFluentVue } from '../../src'

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
      other-link = other link text
      `),
    )

    bundleUk.addResource(
      new FluentResource(ftl`
      link = текст посилання
      other-link = інший текст посилання
      `),
    )

    fluent = createFluentVue({
      bundles: [bundleUk, bundleEn],
    })
  })

  it('can override one locale from a bundle with multiple locales', async () => {
    // Arrange
    const component = {
      template: `
        <div>
          <a v-t:link href="/foo">Fallback text</a><a v-t:other-link href="/other-foo">Other fallback text</a>
        </div>
      `,
      fluent: {
        uk: new FluentResource(ftl`
        link = текст посилання 2
        `),
      },
    }

    // Act
    const mounted = mountWithFluent(fluent, component)

    // Assert
    expect(mounted.html()).toEqual('<div><a href="/foo">текст посилання 2</a><a href="/other-foo">інший текст посилання</a></div>')

    fluent.bundles = [bundleEn]
    await nextTick()

    expect(mounted.html()).toEqual('<div><a href="/foo">link text</a><a href="/other-foo">other link text</a></div>')
  })

  it('can override both locales from a bundle with multiple locales', async () => {
    // Arrange
    const component = {
      template: `
        <div>
          <a v-t:link href="/foo">Fallback text</a><a v-t:other-link href="/other-foo">Other fallback text</a>
        </div>
      `,
      fluent: {
        'uk uk-UA': new FluentResource(ftl`
        link = текст посилання 2
        `),
      },
    }

    // Act
    const mounted = mountWithFluent(fluent, component)

    // Assert
    expect(mounted.html()).toEqual('<div><a href="/foo">текст посилання 2</a><a href="/other-foo">інший текст посилання</a></div>')

    fluent.bundles = [bundleEn]
    await nextTick()

    expect(mounted.html()).toEqual('<div><a href="/foo">link text</a><a href="/other-foo">other link text</a></div>')
  })

  it('can override messages from component bundles', async () => {
    // Arrange
    const component = {
      template: `
        <div>
          <a v-t:link href="/foo">Fallback text</a><a v-t:other-link href="/other-foo">Other fallback text</a>
        </div>
      `,
      fluent: {
        'uk en': new FluentResource(ftl`
        link = Generic link text
        `),
      },
    }

    // Act
    const mounted = mountWithFluent(fluent, component)
    expect(mounted.html()).toEqual('<div><a href="/foo">Generic link text</a><a href="/other-foo">інший текст посилання</a></div>')

    fluent.bundles = [bundleEn]

    await nextTick()
    expect(mounted.html()).toEqual('<div><a href="/foo">Generic link text</a><a href="/other-foo">other link text</a></div>')

    fluent.bundles = [bundleUk]

    await nextTick()
    expect(mounted.html()).toEqual('<div><a href="/foo">Generic link text</a><a href="/other-foo">інший текст посилання</a></div>')

    fluent.bundles = [bundleEn, bundleUk]

    await nextTick()
    expect(mounted.html()).toEqual('<div><a href="/foo">Generic link text</a><a href="/other-foo">other link text</a></div>')
  })

  it('can override messages from global bundles', async () => {
    // Arrange
    const bundleUa = new FluentBundle(['uk-UA'])
    bundleUa.addResource(
      new FluentResource(ftl`
      link = текст посилання ua
      other-link = інший текст посилання ua
      `),
    )

    const component = {
      template: `
        <div>
          <a v-t:link href="/foo">Fallback text</a><a v-t:other-link href="/other-foo">Other fallback text</a>
        </div>
      `,
      fluent: {
        'uk en': new FluentResource(ftl`
        link = Generic link text
        `),
      },
    }

    // Act
    const mounted = mountWithFluent(fluent, component)

    fluent.bundles = [bundleUa]
    await nextTick()

    expect(mounted.html()).toEqual('<div><a href="/foo">текст посилання ua</a><a href="/other-foo">інший текст посилання ua</a></div>')

    fluent.bundles = [bundleUa, bundleUk]
    await nextTick()

    expect(mounted.html()).toEqual('<div><a href="/foo">текст посилання ua</a><a href="/other-foo">інший текст посилання ua</a></div>')

    fluent.bundles = [bundleEn]

    await nextTick()
    expect(mounted.html()).toEqual('<div><a href="/foo">Generic link text</a><a href="/other-foo">other link text</a></div>')

    fluent.bundles = [bundleUk]

    await nextTick()
    expect(mounted.html()).toEqual('<div><a href="/foo">Generic link text</a><a href="/other-foo">інший текст посилання</a></div>')

    fluent.bundles = [bundleEn, bundleUk]

    await nextTick()
    expect(mounted.html()).toEqual('<div><a href="/foo">Generic link text</a><a href="/other-foo">other link text</a></div>')
  })
})
