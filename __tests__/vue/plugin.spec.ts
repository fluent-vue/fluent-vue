import { describe, expect, it } from 'vitest'

import { FluentBundle, FluentResource } from '@fluent/bundle'
import ftl from '@fluent/dedent'

import { mountWithFluent } from '../utils'

import { createFluentVue } from '../../src'

describe('vue integration', () => {
  const bundle = new FluentBundle('en-US')

  bundle.addResource(
    new FluentResource(ftl`
    message = Hello, { $name }!
    sub-message = Hi, { $name }
    `),
  )

  const fluent = createFluentVue({
    bundles: [bundle],
  })

  it('translates messages in a component', () => {
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
      template: '<div>{{ $t(\'message\', { name }) }}</div>',
    }

    // Act
    const mounted = mountWithFluent(fluent, component)

    // Assert
    expect(mounted.html()).toEqual('<div>Hello, \u{2068}John\u{2069}!</div>')
  })

  it('translates messages in sub-component', () => {
    // Arrange
    const child = {
      data: () => ({
        name: 'Alice',
      }),
      template: '<div>{{ $t(\'sub-message\', { name }) }}</div>',
    }

    const component = {
      components: {
        child,
      },
      data: () => ({
        name: 'John',
      }),
      template: '<div>{{ $t(\'message\', { name }) }}<child /></div>',
    }

    // Act
    const mounted = mountWithFluent(fluent, component)

    // Assert
    expect(mounted.html()).toEqual('<div>Hello, \u{2068}John\u{2069}!<div>Hi, \u{2068}Alice\u{2069}</div>\n</div>')
  })

  it('allows to override messages in sub-component', () => {
    // Arrange
    const child = {
      data: () => ({
        name: 'Alice',
      }),
      fluent: {
        'en-US': new FluentResource(ftl`
        sub-message = Hello from child component, { $name }
        `),
      },
      template: '<div>{{ $t(\'sub-message\', { name }) }}</div>',
    }

    const component = {
      components: {
        child,
      },
      data: () => ({
        name: 'John',
      }),
      template: '<div>{{ $t(\'message\', { name }) }}<child /></div>',
    }

    // Act
    const mounted = mountWithFluent(fluent, component)

    // Assert
    expect(mounted.html()).toEqual(
      '<div>Hello, \u{2068}John\u{2069}!<div>Hello from child component, \u{2068}Alice\u{2069}</div>\n</div>',
    )
  })
})
