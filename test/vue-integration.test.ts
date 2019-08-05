import { createLocalVue, mount } from '@vue/test-utils'

import { FluentBundle, ftl } from 'fluent'

import FluentVue from '../src'

describe('vue integration', () => {
  const localVue = createLocalVue()
  localVue.use(FluentVue)

  const bundle = new FluentBundle('en-US', {
    useIsolating: false
  })

  bundle.addMessages(ftl`
    message = Hello, { $name }!
    sub-message = Hi, { $name }
  `)

  const fluent = new FluentVue({
    bundle
  })

  const options = {
    fluent,
    localVue
  }

  it('translates messages in a component', () => {
    // Arrange
    bundle.addMessages(ftl`
      message = Hello, { $name }!
    `)

    const component = {
      data: () => ({
        name: 'John'
      }),
      template: "<div>{{ $t('message', { name }) }}</div>"
    }

    // Act
    const mounted = mount(component, options)

    // Assert
    expect(mounted).toMatchSnapshot()
  })

  it('translates messages in sub-component', () => {
    // Arrange
    bundle.addMessages(ftl`
      message = Hello, { $name }!
    `)

    const child = {
      data: () => ({
        name: 'Alice'
      }),
      template: "<div>{{ $t('sub-message', { name }) }}</div>"
    }

    const component = {
      components: {
        child
      },
      data: () => ({
        name: 'John'
      }),
      template: `
        <div>
          {{ $t('message', { name }) }}
          <child />
        </div>
      `
    }

    // Act
    const mounted = mount(component, options)

    // Assert
    expect(mounted).toMatchSnapshot()
  })

  it('clears instance on component destroy', () => {
    // Arrange
    const component = {
      data: () => ({
        name: 'john'
      }),
      template: "<div>{{ $t('message', { name }) }}</div>"
    }

    const mounted = mount(component, options)

    // Act
    mounted.destroy()

    // Assert
    expect(mounted.vm.$fluent).not.toBeUndefined()

    localVue.nextTick(() => {
      expect(mounted.vm.$fluent).toBeUndefined()
    })
  })

  it('does not try to clear if not initialized', () => {
    // Arrange
    const component = {
      template: '<div>Just text</div>'
    }

    const mounted = mount(component, {
      localVue
    })

    // Act
    mounted.destroy()

    // Assert
    expect(mounted.vm.$fluent).toBeUndefined()

    localVue.nextTick(() => {
      expect(mounted.vm.$fluent).toBeUndefined()
    })
  })
})
