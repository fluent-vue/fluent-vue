import type { FluentVue } from '../../src'
import { FluentBundle, FluentResource } from '@fluent/bundle'

import ftl from '@fluent/dedent'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { isVue2, isVue3 } from 'vue-demi'

import { createFluentVue } from '../../src'
import { mountWithFluent } from '../utils'

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
    expect(mounted.html()).toEqual('<span>Inner data \u{2068}<b>Inner text</b>\u{2069} test</span>')
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
      '<span>Inner data \u{2068}<b>Inner text, Attribute: \u{2068}Extra\u{2069}</b>\u{2069} test</span>',
    )
  })

  it('warns about missing translation', () => {
    // Arrange
    bundle.addResource(
      new FluentResource(ftl`
      key = Inner data {$child} test
      `),
    )

    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})

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
    expect(mounted.html()).toEqual('<span>Hello \u{2068}John\u{2069} \u{2068}<b>Inner text</b>\u{2069} test</span>')
  })

  it('updates on parameter change', async () => {
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
    expect(mounted.html()).toEqual('<span>Hello \u{2068}John\u{2069} \u{2068}<b>Inner text</b>\u{2069} test</span>')

    // Act
    await mounted.setData({ name: 'Alice' })

    // Assert
    expect(mounted.html()).toEqual('<span>Hello \u{2068}Alice\u{2069} \u{2068}<b>Inner text</b>\u{2069} test</span>')
  })

  it('supports html #760', async () => {
    // Arrange
    bundle.addResource(
      new FluentResource(ftl`
      general-pages-terms = Terms

      general-register-info = Register here.<br> But respect <strong>our terms</strong> (see {$showTermsModalSpan}).
        .general-pages-terms = { general-pages-terms }
      `),
    )

    const click = vi.fn()

    const component = {
      methods: {
        showModal(param: string) {
          click(param)
        },
      },
      template: `
      <i18n path="general-register-info" tag="span" html>
        <template #showTermsModalSpan="{ generalPagesTerms }">
          <span class="underline cursor-pointer" @click.prevent="showModal('terms')">{{ generalPagesTerms }}</span>
        </template>
      </i18n>`,
    }

    // Act
    const mounted = mountWithFluent(fluent, component)

    // Assert
    expect(mounted.get('br')).toBeTruthy()
    expect(mounted.get('strong')).toBeTruthy()
    expect(mounted.get('span.underline')).toBeTruthy()
    expect(mounted.html()).toEqual('<span>Register here.<br> But respect <strong>our terms</strong> (see \u{2068}<span class="underline cursor-pointer">Terms</span>\u{2069}).</span>')

    // Just in case check if the click handler is working
    // Act
    await mounted.find('.underline').trigger('click')

    // Assert
    expect(click).toHaveBeenCalledWith('terms')
  })

  it('supports nested html', async () => {
    // Arrange
    bundle.addResource(
      new FluentResource(ftl`
      key = <span>Test <span class="inner"> Inner <strong class="strong">strong</strong> </span></span>
      `),
    )

    const component = {
      template: '<i18n path="key" tag="span" html></i18n>',
    }

    // Act
    const mounted = mountWithFluent(fluent, component)

    // Assert
    expect(mounted.get('span')).toBeTruthy()
    expect(mounted.get('strong')).toBeTruthy()
    expect(mounted.html()).toEqual('<span><span>Test <span class="inner"> Inner <strong class="strong">strong</strong> </span></span></span>')
  })

  it.runIf(isVue3)('can work with tag=false', async () => {
    // Arrange
    bundle.addResource(
      new FluentResource(ftl`
    key = Hello {$name}
    `),
    )

    const component = {
      data() {
        return {
          name: 'John',
        }
      },
      template: `
        <i18n path="key" :args="{ name }" :tag="false"></i18n>`,
    }

    // Act
    const mounted = mountWithFluent(fluent, component)

    // Assert
    expect(mounted.html()).toEqual('Hello \u{2068}John\u{2069}')
  })

  it.runIf(isVue3)('can work with no-tag', async () => {
    // Arrange
    bundle.addResource(
      new FluentResource(ftl`
    key = Hello {$name}
    `),
    )

    const component = {
      data() {
        return {
          name: 'John',
        }
      },
      template: `
        <i18n path="key" :args="{ name }" no-tag></i18n>`,
    }

    // Act
    const mounted = mountWithFluent(fluent, component)

    // Assert
    expect(mounted.html()).toEqual('Hello \u{2068}John\u{2069}')
  })

  it.runIf(isVue2)('warns when used with tag=false', async () => {
    // Arrange
    bundle.addResource(
      new FluentResource(ftl`
    key = Hello {$name}
    `),
    )

    const component = {
      data() {
        return {
          name: 'John',
        }
      },
      template: `
        <i18n path="key" :args="{ name }" :tag="false"></i18n>`,
    }

    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})

    // Act
    const mounted = mountWithFluent(fluent, component)

    // Assert
    expect(mounted.html()).toEqual('')
    expect(warn).toHaveBeenCalledTimes(1)
    expect(warn).toHaveBeenCalledWith('[fluent-vue] Vue 2 requires a root element when rendering components. Please, use `tag` prop to specify the root element.')

    // Cleanup
    warn.mockRestore()
  })
})
