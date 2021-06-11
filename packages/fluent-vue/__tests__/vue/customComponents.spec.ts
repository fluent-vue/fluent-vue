/**
 * @jest-environment jsdom
 */

import { FluentBundle, FluentResource } from '@fluent/bundle'
import ftl from '@fluent/dedent'

import { mountWithFluent } from '../utils'

import { createFluentVue, FluentVue } from '../../src'

describe('method', () => {
  let fluent: FluentVue
  let bundle: FluentBundle

  beforeEach(() => {
    bundle = new FluentBundle('en-US')

    fluent = createFluentVue({
      bundles: [bundle]
    })
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
      template: '<div :attr="attrs.attr">{{ text }}</div>'
    }

    const component = {
      components: {
        child
      },
      template: '<child :text="$t(\'key\')" :attrs="$ta(\'key\')"></child>'
    }

    // Act
    const mounted = mountWithFluent(fluent, component)

    // Assert
    expect(mounted.html()).toEqual('<div attr="Attr value">Inner data</div>')
  })

  it('works without message text', () => {
    // Arrange
    bundle.addResource(
      new FluentResource(ftl`
      key =
        .attr = Attr value
      `)
    )

    const component = {
      template: '<div v-bind="$ta(\'key\')"></div>'
    }

    // Act
    const mounted = mountWithFluent(fluent, component)

    // Assert
    expect(mounted.html()).toEqual('<div attr="Attr value"></div>')
  })

  it('renders fluent kebab attributes correctly', () => {
    // Arrange
    bundle.addResource(
      new FluentResource(ftl`
      key =
        .kebab-attr = Attr value
      `)
    )

    const component = {
      template: '<div v-bind="$ta(\'key\')"></div>'
    }

    // Act
    const mounted = mountWithFluent(fluent, component)

    // Assert
    expect(mounted.html()).toEqual('<div kebab-attr="Attr value"></div>')
  })

  it('warns about missing translation', () => {
    // Arange
    bundle.addResource(
      new FluentResource(ftl`
      key =
        .attr = Attr value
      `)
    )

    const warn = jest.spyOn(console, 'warn').mockImplementation()

    const component = {
      template: '<div v-bind="$ta(\'missing-key\')"></div>'
    }

    // Act
    const mounted = mountWithFluent(fluent, component)

    // Assert
    expect(mounted.html()).toEqual('<div></div>')
    expect(warn).toHaveBeenCalledTimes(1)
    expect(warn).toHaveBeenCalledWith(
      '[fluent-vue] Could not find translation for key [missing-key]'
    )

    // Cleanup
    warn.mockRestore()
  })
})
