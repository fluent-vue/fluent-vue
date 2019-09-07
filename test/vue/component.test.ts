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

    bundle = new FluentBundle('en-US', {
      useIsolating: false
    })

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
    expect(mounted).toMatchSnapshot()
  })
})
