import { createLocalVue, mount } from '@vue/test-utils'

import { FluentBundle, FluentResource } from '@fluent/bundle'
import ftl from '@fluent/dedent'

import FluentVue from '../src'

describe('vue integration', () => {
  const localVue = createLocalVue()
  localVue.use(FluentVue)

  const bundle = new FluentBundle('en-US', {
    useIsolating: false
  })

  bundle.addResource(
    new FluentResource(ftl`
    message = Hello, { $name }!
    sub-message = Hi, { $name }
  `)
  )

  const fluent = new FluentVue({
    bundle
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

    // Act
    const mounted = mount(component, options)

    // Assert
    expect(mounted).toMatchSnapshot()
  })
})
