import { createLocalVue, mount } from '@vue/test-utils'

import { FluentBundle, FluentResource } from '@fluent/bundle'
import ftl from '@fluent/dedent'

import FluentVue from '../src'

describe('directive', () => {
  let options: any
  let bundle: any

  beforeEach(() => {
    const localVue = createLocalVue()
    localVue.use(FluentVue)

    bundle = new FluentBundle('en-US', {
      useIsolating: false
    })

    const fluent = new FluentVue({
      bundle
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
      template: `<a v-t="{ key: 'link' }" href="/foo">Fallback text</a>`
    }

    // Act
    const mounted = mount(component, options)

    // Assert
    expect(mounted).toMatchSnapshot()
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
      template: `<a v-t="{ key: 'link', arg: { name: 'John' } }" href="/foo">Fallback text</a>`
    }

    // Act
    const mounted = mount(component, options)

    // Assert
    expect(mounted).toMatchSnapshot()
  })
})
