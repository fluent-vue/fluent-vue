import { createLocalVue, mount } from '@vue/test-utils'

import { FluentBundle, FluentResource } from '@fluent/bundle'
import ftl from '@fluent/dedent'

import FluentVue from '../src'

describe('vue integration', () => {
  const localVue = createLocalVue()
  localVue.use(FluentVue)

  const bundle = new FluentBundle('en-US')

  bundle.addResource(
    new FluentResource(ftl`
    message = Hello, { $name }!
    sub-message = Hi, { $name }
  `)
  )

  const fluent = new FluentVue({
    bundles: [bundle]
  })

  const options = {
    fluent,
    localVue
  }

  it('warns about missing translation', () => {
    // Arrange
    const component = {
      template: "<div>{{ $t('message-not-found') }}</div>"
    }

    const warn = jest.fn()
    console.warn = warn

    // Act
    const mounted = mount(component, options)

    // Assert
    expect(mounted).toMatchSnapshot()
    expect(warn).toHaveBeenCalledTimes(1)
  })

  it('warns about fluent errors', () => {
    // Arrange
    bundle.addResource(
      new FluentResource(ftl`
      message = { NUMBER($arg) }
      `)
    )

    const component = {
      template: "<div>{{ $t('message') }}</div>"
    }

    const warn = jest.fn()
    console.warn = warn

    // Act
    const mounted = mount(component, options)

    // Assert
    expect(mounted).toMatchSnapshot()
    expect(warn).toHaveBeenCalledTimes(1)
  })
})
