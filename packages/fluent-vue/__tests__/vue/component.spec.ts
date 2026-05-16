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

  it('uses correct translation context when inside slot (#980)', () => {
    // Arrange
    // OtherComponent.vue - component that receives slot
    const otherComponent = {
      template: '<div class="other"><slot /></div>',
      fluent: {
        'en-US': new FluentResource(ftl`
        test = … but this one is used: { $placeholder }
        `),
      },
    }

    // SomeComponent.vue - component that passes slot content
    const someComponent = {
      components: {
        OtherComponent: otherComponent,
      },
      template: `
        <OtherComponent>
          <i18n path="test" :args="{ placeholder: 'value' }" data-test="i18n"></i18n>
        </OtherComponent>
      `,
      fluent: {
        'en-US': new FluentResource(ftl`
        test = This should be used: { $placeholder }
        `),
      },
    }

    // Act
    const mounted = mountWithFluent(fluent, someComponent)

    // Assert
    // The translation should come from SomeComponent, not OtherComponent
    expect(mounted.html()).toEqual('<div class="other"><span data-test="i18n">This should be used: \u{2068}value\u{2069}</span></div>')
  })

  it('uses correct context with named slots', () => {
    // Arrange
    const slotRenderer = {
      template: '<div><slot name="header" /></div>',
      fluent: {
        'en-US': new FluentResource(ftl`
        greeting = Wrong translation
        `),
      },
    }

    const slotOwner = {
      components: {
        SlotRenderer: slotRenderer,
      },
      template: `
        <SlotRenderer>
          <template #header>
            <i18n path="greeting"></i18n>
          </template>
        </SlotRenderer>
      `,
      fluent: {
        'en-US': new FluentResource(ftl`
        greeting = Correct translation
        `),
      },
    }

    // Act
    const mounted = mountWithFluent(fluent, slotOwner)

    // Assert
    expect(mounted.html()).toEqual('<div><span>Correct translation</span></div>')
  })

  it('uses correct context with nested slots', () => {
    // Arrange
    // This tests a complex scenario:
    // InnerSlotRenderer renders a slot inside OuterSlotRenderer
    // OuterSlotRenderer forwards its slot to InnerSlotRenderer
    // The actual slot content (<i18n>) is provided by slotOwner

    const innerSlotRenderer = {
      template: '<div class="inner"><slot /></div>',
      fluent: {
        'en-US': new FluentResource(ftl`
        message = Inner component message
        `),
      },
    }

    const outerSlotRenderer = {
      components: {
        InnerSlotRenderer: innerSlotRenderer,
      },
      // OuterSlotRenderer receives slot content and passes it to InnerSlotRenderer
      // The <slot/> here is re-rendered in outer's context
      template: `
        <div class="outer">
          <InnerSlotRenderer>
            <slot />
          </InnerSlotRenderer>
        </div>
      `,
      fluent: {
        'en-US': new FluentResource(ftl`
        message = Outer component message
        `),
      },
    }

    const slotOwner = {
      components: {
        OuterSlotRenderer: outerSlotRenderer,
      },
      template: `
        <OuterSlotRenderer>
          <i18n path="message"></i18n>
        </OuterSlotRenderer>
      `,
      fluent: {
        'en-US': new FluentResource(ftl`
        message = Owner component message
        `),
      },
    }

    // Act
    const mounted = mountWithFluent(fluent, slotOwner)

    // Assert
    expect(mounted.html()).toContain('<span>Owner component message</span>')
  })

  it('uses global translations when no parent has fluent in slot', () => {
    // Arrange
    bundle.addResource(
      new FluentResource(ftl`
      global-key = Global translation
      `),
    )

    const slotRenderer = {
      template: '<div><slot /></div>',
      // No fluent
    }

    const slotOwner = {
      components: {
        SlotRenderer: slotRenderer,
      },
      template: `
        <SlotRenderer>
          <i18n path="global-key"></i18n>
        </SlotRenderer>
      `,
      // No fluent
    }

    // Act
    const mounted = mountWithFluent(fluent, slotOwner)

    // Assert
    expect(mounted.html()).toEqual('<div><span>Global translation</span></div>')
  })

  it('works with multiple i18n components in same slot', () => {
    // Arrange
    const slotRenderer = {
      template: '<div><slot /></div>',
      fluent: {
        'en-US': new FluentResource(ftl`
        msg1 = Renderer msg1
        msg2 = Renderer msg2
        `),
      },
    }

    const slotOwner = {
      components: {
        SlotRenderer: slotRenderer,
      },
      template: `
        <SlotRenderer>
          <i18n path="msg1"></i18n><i18n path="msg2"></i18n>
        </SlotRenderer>
      `,
      fluent: {
        'en-US': new FluentResource(ftl`
        msg1 = Owner msg1
        msg2 = Owner msg2
        `),
      },
    }

    // Act
    const mounted = mountWithFluent(fluent, slotOwner)

    // Assert
    expect(mounted.html()).toEqual('<div><span>Owner msg1</span><span>Owner msg2</span></div>')
  })

  it('uses correct scope when i18n is in a component without fluent that is slotted', () => {
    // Arrange
    // This verifies that when a component has no fluent translations,
    // it falls back to global translations (not parent's translations)
    bundle.addResource(
      new FluentResource(ftl`
      scope-test = Global translation
      `),
    )

    const slotRenderer = {
      name: 'SlotRenderer',
      template: '<div><slot /></div>',
      fluent: {
        'en-US': new FluentResource(ftl`
        scope-test = Wrong: Renderer
        `),
      },
    }

    const wrapper = {
      name: 'Wrapper',
      template: '<i18n path="scope-test"></i18n>',
      // No fluent here - should use global translations
    }

    const parent = {
      name: 'Parent',
      components: { SlotRenderer: slotRenderer, Wrapper: wrapper },
      template: '<SlotRenderer><Wrapper /></SlotRenderer>',
      fluent: {
        'en-US': new FluentResource(ftl`
        scope-test = Wrong: Parent
        `),
      },
    }

    // Act
    const mounted = mountWithFluent(fluent, parent)

    // Assert
    expect(mounted.html()).toEqual('<div><span>Global translation</span></div>')
  })

  it('handles i18n in slot with dynamic component rendering', () => {
    // Arrange
    // Ensures $vnode.context works with dynamic :is components
    const dynamicSlot = {
      name: 'DynamicSlot',
      template: '<div><slot /></div>',
      fluent: {
        'en-US': new FluentResource(ftl`
        dynamic-test = Wrong: Dynamic Slot
        `),
      },
    }

    const owner = {
      name: 'Owner',
      components: { DynamicSlot: dynamicSlot },
      template: '<DynamicSlot><i18n path="dynamic-test"></i18n></DynamicSlot>',
      fluent: {
        'en-US': new FluentResource(ftl`
        dynamic-test = Correct: Owner
        `),
      },
    }

    // Act
    const mounted = mountWithFluent(fluent, owner)

    // Assert
    expect(mounted.html()).toEqual('<div><span>Correct: Owner</span></div>')
  })
})
