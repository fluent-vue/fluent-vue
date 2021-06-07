/**
 * @jest-environment jsdom
 */

import { FluentBundle, FluentResource } from '@fluent/bundle'
import ftl from '@fluent/dedent'

import { mountWithFluent } from './utils'

import { createFluentVue } from '../src'

describe('vue integration', () => {
  const bundle = new FluentBundle('en-US')

  bundle.addResource(
    new FluentResource(ftl`
    message = Hello, { $name }!
    sub-message = Hi, { $name }
  `)
  )

  const fluent = createFluentVue({
    locale: 'en-US',
    bundles: [bundle]
  })

  it('warns about missing translation', () => {
    // Arrange
    const component = {
      template: "<div>{{ $t('message-not-found') }}</div>"
    }

    const warn = jest.spyOn(console, 'warn').mockImplementation()

    // Act
    const mounted = mountWithFluent(fluent, component)

    // Assert
    expect(mounted.html()).toEqual('<div>message-not-found</div>')
    expect(warn).toHaveBeenCalledTimes(1)
    expect(warn).toHaveBeenCalledWith('[fluent-vue] Could not find translation for key [message-not-found]')

    // Cleanup
    warn.mockRestore()
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

    const warn = jest.spyOn(console, 'warn').mockImplementation()

    // Act
    const mounted = mountWithFluent(fluent, component)

    // Assert
    expect(mounted.html()).toEqual('<div>{NUMBER($arg)}</div>')
    expect(warn).toHaveBeenCalledTimes(1)
    expect(warn).toHaveBeenCalledWith('[fluent-vue] Error when formatting', new Error('Unknown variable: $arg'))

    // Cleanup
    warn.mockRestore()
  })
})
