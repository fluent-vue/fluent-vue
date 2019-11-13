import { createLocalVue, mount } from '@vue/test-utils'

import { FluentBundle, FluentResource } from '@fluent/bundle'
import ftl from '@fluent/dedent'

import FluentVue from '../../src'

describe('directive', () => {
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

  it('translates text content', () => {
    // Arrange
    bundle.addResource(
      new FluentResource(ftl`
      link = Link text
      `)
    )

    const component = {
      data: () => ({
        name: 'John'
      }),
      template: `<a v-t:link href="/foo">Fallback text</a>`
    }

    // Act
    const mounted = mount(component, options)

    // Assert
    expect(mounted).toMatchSnapshot()
  })

  it('warns about missing key arg', () => {
    // Arrange
    const component = {
      template: `<a v-t href="/foo">Fallback text</a>`
    }

    const warn = jest.fn()
    console.warn = warn

    // Act
    const mounted = mount(component, options)

    // Assert
    expect(mounted).toMatchSnapshot()
    expect(warn).toHaveBeenCalledTimes(1)
  })

  it('can use parameters', () => {
    // Arrange
    bundle.addResource(
      new FluentResource(ftl`
      link = Hello {$name}
      `)
    )

    const component = {
      data: () => ({
        name: 'John'
      }),
      template: `<a v-t:link="{ name }" href="/foo">Fallback text</a>`
    }

    // Act
    const mounted = mount(component, options)

    // Assert
    expect(mounted).toMatchSnapshot()
  })

  it('can translate DOM attributes', () => {
    // Arrange
    bundle.addResource(
      new FluentResource(ftl`
      link = Hello {$name}
        .aria-label = Localized aria
      `)
    )

    const component = {
      data: () => ({
        name: 'John'
      }),
      template: `<a v-t:link.aria-label="{ name }" href="/foo" aria-label="Fallback aria">Fallback text</a>`
    }

    // Act
    const mounted = mount(component, options)

    // Assert
    expect(mounted).toMatchSnapshot()
  })

  it('automatically binds whitelisted attrs', () => {
    // Arrange
    bundle.addResource(
      new FluentResource(ftl`
      link = Text
        .aria-label = Hello {$name}
        .not-allowed = Not allowed attrs value
      `)
    )

    const component = {
      data: () => ({
        name: 'John'
      }),
      template: `<a v-t:link="{ name }">Fallback</a>`
    }

    // Act
    const mounted = mount(component, options)

    // Assert
    expect(mounted).toMatchSnapshot()
  })

  it('works without fallbacks', () => {
    // Arrange
    bundle.addResource(
      new FluentResource(ftl`
      link = Hello {$name}
        .aria-label = Localized aria
      `)
    )

    const component = {
      data: () => ({
        name: 'John'
      }),
      template: `<a v-t:link.aria-label="{ name }"></a>`
    }

    // Act
    const mounted = mount(component, options)

    // Assert
    expect(mounted).toMatchSnapshot()
  })

  it('updates translations on component update', () => {
    // Arrange
    bundle.addResource(
      new FluentResource(ftl`
      link = Hello {$name}
        .aria-label = Localized aria
      `)
    )

    const component = {
      data: () => ({
        name: 'John'
      }),
      template: `<a v-t:link.aria-label="{ name }"></a>`
    }

    const mounted = mount(component, options)

    expect(mounted).toMatchSnapshot()

    // Act
    mounted.setData({ name: 'Anna' })

    // Assert
    expect(mounted).toMatchSnapshot()
  })

  it('preserves translations on component update', () => {
    // Arrange
    bundle.addResource(
      new FluentResource(ftl`
      link =
        .aria-label = Hello {$name}
      `)
    )

    const component = {
      data: () => ({
        name: 'John',
        otherName: 'Anna'
      }),
      template: `<a v-t:link.aria-label="{ name }">{{ otherName }}</a>`
    }

    const mounted = mount(component, options)

    expect(mounted).toMatchSnapshot()

    // Act
    mounted.setData({ otherName: 'Test' })

    // Assert
    expect(mounted).toMatchSnapshot()
  })

  it('works with multiple attributes', () => {
    // Arrange
    bundle.addResource(
      new FluentResource(ftl`
      link = Text
        .aria-label = Hello {$name}
        .placeholder = Placeholder
      `)
    )

    const component = {
      data: () => ({
        name: 'John'
      }),
      template: `<a v-t:link.aria-label.placeholder="{ name }">Fallback</a>`
    }

    // Act
    const mounted = mount(component, options)

    // Assert
    expect(mounted).toMatchSnapshot()
  })
})
