import { createLocalVue, mount } from '@vue/test-utils'

import { FluentBundle, FluentResource } from '@fluent/bundle'
import ftl from '@fluent/dedent'

import FluentVue from '../../src'

describe('method', () => {
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

  it('works with vue components', () => {
    // Arrange
    bundle.addResource(
      new FluentResource(ftl`
      key = Inner data
        .attr = Attr value
      `)
    )

    const child = {
      props: {
        text: { type: String },
        attrs: { type: Object }
      },
      template: `<div :attr="attrs.attr">{{ text }}</div>`
    }

    const component = {
      components: {
        child
      },
      template: `<child :text="$t('key')" :attrs="$ta('key')"></child>`
    }

    // Act
    const mounted = mount(component, options)

    // Assert
    expect(mounted.html()).toEqual(`<div attr="Attr value">Inner data</div>`)
  })

  it('warns about missing translation', () => {
    // Arange
    bundle.addResource(
      new FluentResource(ftl`
      key =
        .attr = Attr value
      `)
    )

    const warn = jest.fn()
    console.warn = warn

    const component = {
      template: `<div v-bind="$ta('missing-key')"></div>`
    }

    // Act
    const mounted = mount(component, options)

    // Assert
    expect(mounted.html()).toEqual(`<div></div>`)
    expect(warn).toHaveBeenCalledTimes(1)
  })
})
