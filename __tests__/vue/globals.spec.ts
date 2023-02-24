import { beforeEach, describe, expect, it } from 'vitest'

import { FluentBundle, FluentResource } from '@fluent/bundle'
import ftl from '@fluent/dedent'

import { mountWithFluent } from '../utils'

import { createFluentVue } from '../../src'

describe('globals', () => {
  let bundle: FluentBundle

  beforeEach(() => {
    bundle = new FluentBundle('en-US')
  })

  it('can rename t directive', () => {
    const fluent = createFluentVue({
      bundles: [bundle],
      globals: {
        directive: 'test',
      },
    })

    // Arrange
    bundle.addResource(
      new FluentResource(ftl`
      link = Link text
      `),
    )

    const component = {
      template: '<a v-test:link href="/foo">Fallback text</a>',
    }

    // Act
    const mounted = mountWithFluent(fluent, component)

    // Assert
    expect(mounted.html()).toEqual('<a href="/foo">Link text</a>')
  })

  it('can rename global $t', () => {
    const fluent = createFluentVue({
      bundles: [bundle],
      globals: {
        functions: {
          format: '$test',
        },
      },
    })

    // Arrange
    bundle.addResource(
      new FluentResource(ftl`
      message = Hello, { $name }!
      `),
    )

    const component = {
      data: () => ({
        name: 'John',
      }),
      template: '<div>{{ $test("message", { name }) }}</div>',
    }

    // Act
    const mounted = mountWithFluent(fluent, component)

    // Assert
    expect(mounted.html()).toEqual('<div>Hello, \u{2068}John\u{2069}!</div>')
  })

  it('can rename global $ta', () => {
    const fluent = createFluentVue({
      bundles: [bundle],
      globals: {
        functions: {
          formatAttrs: '$test',
        },
      },
    })

    // Arrange
    bundle.addResource(
      new FluentResource(ftl`
      key =
        .attr = Attr value
      `),
    )

    const component = {
      template: '<div v-bind="$test(\'key\')"></div>',
    }

    // Act
    const mounted = mountWithFluent(fluent, component)

    // Assert
    expect(mounted.html()).toEqual('<div attr="Attr value"></div>')
  })

  it('can rename component', () => {
    const fluent = createFluentVue({
      bundles: [bundle],
      globals: {
        component: 'test',
      },
    })

    // Arrange
    bundle.addResource(
      new FluentResource(ftl`
      key = Inner data
      `),
    )

    const component = {
      template: '<test path="key"></test>',
    }

    // Act
    const mounted = mountWithFluent(fluent, component)

    // Assert
    expect(mounted.html()).toEqual('<span>Inner data</span>')
  })
})
