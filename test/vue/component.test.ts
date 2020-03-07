import { createLocalVue, mount } from '@vue/test-utils'

import { FluentBundle, FluentResource } from '@fluent/bundle'
import ftl from '@fluent/dedent'

import FluentVue from '../../src'

describe('component', () => {
  let options: any
  let bundle: FluentBundle

  beforeEach(() => {
    const localVue = createLocalVue()
    localVue.use(FluentVue)

    bundle = new FluentBundle('en-US')

    const fluent = new FluentVue({
      bundles: [bundle]
    })

    options = {
      fluent,
      localVue
    }
  })

  it('handles simple translations', () => {
    // Arrange
    bundle.addResource(
      new FluentResource(ftl`
      key = Inner data
      `)
    )

    const component = {
      template: '<i18n path="key"></i18n>'
    }

    // Act
    const mounted = mount(component, options)

    // Assert
    expect(mounted.html()).toEqual(`<span>Inner data</span>`)
  })

  it('interpolates components', () => {
    // Arrange
    bundle.addResource(
      new FluentResource(ftl`
      key = Inner data {$child} test
      `)
    )

    const component = {
      template: `
        <i18n path="key">
          <template #child>
            <b>Inner text</b>
          </template>
        </i18n>`
    }

    // Act
    const mounted = mount(component, options)

    // Assert
    expect(mounted.html()).toEqual(`<span>Inner data ⁨<b>Inner text</b>⁩ test</span>`)
  })

  it('warns about missing translation', () => {
    // Arrange
    bundle.addResource(
      new FluentResource(ftl`
      key = Inner data {$child} test
      `)
    )

    const warn = jest.fn()
    console.warn = warn

    const component = {
      template: `
        <i18n path="missing-key">
          <template #child>
            <b>Inner text</b>
          </template>
        </i18n>`
    }

    // Act
    const mounted = mount(component, options)

    // Assert
    expect(mounted.html()).toEqual(`<span>missing-key</span>`)
    expect(warn).toHaveBeenCalledTimes(1)
  })

  it('can accept parameters', () => {
    // Arrange
    bundle.addResource(
      new FluentResource(ftl`
      key = Hello {$name} {$child} test
      `)
    )

    const component = {
      data() {
        return {
          name: 'John'
        }
      },
      template: `
        <i18n path="key" :args="{ name }">
          <template #child>
            <b>Inner text</b>
          </template>
        </i18n>`
    }

    // Act
    const mounted = mount(component, options)

    // Assert
    expect(mounted.html()).toEqual(`<span>Hello ⁨John⁩ ⁨<b>Inner text</b>⁩ test</span>`)
  })
})
