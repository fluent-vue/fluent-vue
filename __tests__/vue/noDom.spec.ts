import { beforeAll, describe, expect, it, vi } from 'vitest'

import { FluentBundle, FluentResource } from '@fluent/bundle'
import ftl from '@fluent/dedent'

import { DOMParser as HappyDomParser } from 'happy-dom'

import { createFluentVue } from '../../src'
import { mountWithFluent } from '../utils'

describe('component html support', () => {
  beforeAll(() => {
    // @ts-expect-error - we're testing the error case
    // eslint-disable-next-line no-global-assign
    DOMParser = undefined
  })

  it('throws if no access to DOMParser', () => {
    // Arrange
    const bundle = new FluentBundle('en-US')
    bundle.addResource(
      new FluentResource(ftl`
      key = Hello {$name}<br>How are you?
      `),
    )

    const fluent = createFluentVue({
      bundles: [bundle],
    })

    const component = {
      data() {
        return {
          name: 'John',
        }
      },
      template: `
        <i18n path="key" :args="{ name }" html></i18n>`,
    }

    // Act
    const mount = () => mountWithFluent(fluent, component)

    // Assert
    expect(mount).toThrow('[fluent-vue] DOMParser is not available. Please provide a custom parseMarkup function.')
  })

  it('works with custom parseMarkup function', () => {
    // Arrange
    const bundle = new FluentBundle('en-US')
    bundle.addResource(
      new FluentResource(ftl`
      key = Hello {$name}<br>How are you?
      `),
    )

    const fluent = createFluentVue({
      bundles: [bundle],
      parseMarkup: (markup: string) => {
        const parser = new HappyDomParser()
        const doc = parser.parseFromString(markup, 'text/html')
        const nodes = Array.from(doc.body.childNodes)

        return nodes
      },
    })

    const component = {
      data() {
        return {
          name: 'John',
        }
      },
      template: `
        <i18n path="key" :args="{ name }" html></i18n>`,
    }

    // Act
    const mounted = mountWithFluent(fluent, component)

    // Assert
    expect(mounted.html()).toMatchInlineSnapshot('"<span>Hello \u{2068}John\u{2069}<br>How are you?</span>"')
  })

  it('warn about not support markup', () => {
    // Arrange
    const bundle = new FluentBundle('en-US')
    bundle.addResource(
      new FluentResource(ftl`
      key = Hello {$name}<br>How are you?<!-- this is a comment -->
      `),
    )

    const fluent = createFluentVue({
      bundles: [bundle],
      parseMarkup: (markup: string) => {
        const parser = new HappyDomParser()
        const doc = parser.parseFromString(markup, 'text/html')
        const nodes = Array.from(doc.body.childNodes)

        return nodes
      },
    })

    const component = {
      data() {
        return {
          name: 'John',
        }
      },
      template: `
        <i18n path="key" :args="{ name }" html></i18n>`,
    }

    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})

    // Act
    const mounted = mountWithFluent(fluent, component)

    // Assert
    expect(mounted.html()).toMatchInlineSnapshot('"<span>Hello \u{2068}John\u{2069}<br>How are you?</span>"')
    expect(warn).toHaveBeenCalledWith('[fluent-vue] Unsupported node type: 8. If you need support for it, please, create an issue in fluent-vue repository.')

    // Cleanup
    warn.mockRestore()
  })
})
