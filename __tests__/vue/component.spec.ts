import { beforeEach, describe, expect, it, spyOn } from 'vitest'

import { FluentBundle, FluentResource } from '@fluent/bundle'
import ftl from '@fluent/dedent'

import { mountWithFluent } from '../utils'

import type { FluentVue } from '../../src'
import { createFluentVue } from '../../src'

describe('component', () => {
  let fluent: FluentVue
  let bundle: FluentBundle

  beforeEach(() => {
    bundle = new FluentBundle('en-US')

    fluent = createFluentVue({
      bundles: [bundle],
    })
  })

  it('handles simple translations', () => {
    // Arrange
    bundle.addResource(
      new FluentResource(ftl`
      key = Inner data
      `),
    )

    const component = {
      template: '<i18n path="key"></i18n>',
    }

    // Act
    const mounted = mountWithFluent(fluent, component)

    // Assert
    expect(mounted.html()).toEqual('<span>Inner data</span>')
  })

  it('preserves attributes', () => {
    // Arrange
    bundle.addResource(
      new FluentResource(ftl`
      key = Inner data
      `),
    )

    const component = {
      template: '<i18n path="key" class="component"></i18n>',
    }

    // Act
    const mounted = mountWithFluent(fluent, component)

    // Assert
    expect(mounted.html()).toEqual('<span class="component">Inner data</span>')
  })

  it('works with grandparent translations', () => {
    // Arrange
    bundle.addResource(
      new FluentResource(ftl`
      key = Inner data
      `),
    )

    const child = {
      template: '<b><slot /></b>',
    }

    const component = {
      components: {
        child,
      },
      template: '<div><child><i18n path="key"></i18n></child></div>',
    }

    // Act
    const mounted = mountWithFluent(fluent, component)

    // Assert
    expect(mounted.html()).toEqual('<div><b><span>Inner data</span></b></div>')
  })

  it('works with local component messages', () => {
    // Arrange
    const child = {
      template: '<b><slot /></b>',
    }

    const component = {
      components: {
        child,
      },
      template: '<div><child><i18n path="i18n-key"></i18n></child></div>',
      fluent: {
        'en-US': new FluentResource(ftl`
        i18n-key = Inner data
        `),
      },
    }

    // Act
    const mounted = mountWithFluent(fluent, component)

    // Assert
    expect(mounted.html()).toEqual('<div><b><span>Inner data</span></b></div>')
  })

  it('interpolates components', () => {
    // Arrange
    bundle.addResource(
      new FluentResource(ftl`
      key = Inner data {$child} test
      `),
    )

    const component = {
      template: `
        <i18n path="key">
          <template #child>
            <b>Inner text</b>
          </template>
        </i18n>`,
    }

    // Act
    const mounted = mountWithFluent(fluent, component)

    // Assert
    expect(mounted.html()).toEqual('<span>Inner data ⁨<b>Inner text</b>⁩ test</span>')
  })

  it('interpolates components and provide camelized translation attributes', () => {
    // Arrange
    bundle.addResource(
      new FluentResource(ftl`
      key = Inner data {$child} test
        .kebab-attr1 = Attribute: {$extra}
      `),
    )

    const component = {
      template: `
        <i18n path="key" :args="{ extra: 'Extra' }">
          <template #child="{ kebabAttr1 }">
            <b>Inner text, {{ kebabAttr1 }}</b>
          </template>
        </i18n>`,
    }

    // Act
    const mounted = mountWithFluent(fluent, component)

    // Assert
    expect(mounted.html()).toEqual(
      '<span>Inner data ⁨<b>Inner text, Attribute: ⁨Extra⁩</b>⁩ test</span>',
    )
  })

  it('warns about missing translation', () => {
    // Arrange
    bundle.addResource(
      new FluentResource(ftl`
      key = Inner data {$child} test
      `),
    )

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    const warn = spyOn(console, 'warn').mockImplementation(() => {})

    const component = {
      template: `
        <i18n path="missing-key">
          <template #child>
            <b>Inner text</b>
          </template>
        </i18n>`,
    }

    // Act
    const mounted = mountWithFluent(fluent, component)

    // Assert
    expect(mounted.html()).toEqual('<span>missing-key</span>')
    expect(warn).toHaveBeenCalledTimes(1)
    expect(warn).toHaveBeenCalledWith(
      '[fluent-vue] Could not find translation for key [missing-key]',
    )

    // Cleanup
    warn.mockRestore()
  })

  it('can accept parameters', () => {
    // Arrange
    bundle.addResource(
      new FluentResource(ftl`
      key = Hello {$name} {$child} test
      `),
    )

    const component = {
      data() {
        return {
          name: 'John',
        }
      },
      template: `
        <i18n path="key" :args="{ name }">
          <template #child>
            <b>Inner text</b>
          </template>
        </i18n>`,
    }

    // Act
    const mounted = mountWithFluent(fluent, component)

    // Assert
    expect(mounted.html()).toEqual('<span>Hello ⁨John⁩ ⁨<b>Inner text</b>⁩ test</span>')
  })

  it('updates on parameter change', async() => {
    // Arrange
    bundle.addResource(
      new FluentResource(ftl`
      key = Hello {$name} {$child} test
      `),
    )

    const component = {
      data() {
        return {
          name: 'John',
        }
      },
      template: `
        <i18n path="key" :args="{ name }">
          <template #child>
            <b>Inner text</b>
          </template>
        </i18n>`,
    }

    const mounted = mountWithFluent(fluent, component)
    expect(mounted.html()).toEqual('<span>Hello ⁨John⁩ ⁨<b>Inner text</b>⁩ test</span>')

    // Act
    await mounted.setData({ name: 'Alice' })

    // Assert
    expect(mounted.html()).toEqual('<span>Hello ⁨Alice⁩ ⁨<b>Inner text</b>⁩ test</span>')
  })
})
