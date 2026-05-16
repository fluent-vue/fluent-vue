import { FluentBundle, FluentResource } from '@fluent/bundle'

import ftl from '@fluent/dedent'
import { describe, expect, it, vi } from 'vitest'

import { createFluentVue } from '../src'
import { mountWithFluent } from './utils'

describe('vue integration', () => {
  const bundle = new FluentBundle('en-US')

  bundle.addResource(
    new FluentResource(ftl`
    message = Hello, { $name }!
    sub-message = Hi, { $name }
  `),
  )

  it('warns about fluent errors', () => {
    // Arrange
    const fluent = createFluentVue({
      bundles: [bundle],
    })

    bundle.addResource(
      new FluentResource(ftl`
      message-with-error = { NUMBER($arg) }
      `),
    )

    const component = {
      template: '<div>{{ $t("message-with-error") }}</div>',
    }

    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})

    // Act
    const mounted = mountWithFluent(fluent, component)

    // Assert
    expect(mounted.html()).toEqual('<div>{NUMBER($arg)}</div>')
    expect(warn).toHaveBeenCalledTimes(1)
    expect(warn).toHaveBeenCalledWith('[fluent-vue] Error when formatting message with key [message-with-error]', new ReferenceError('Unknown variable: $arg'))

    // Cleanup
    warn.mockRestore()
  })

  describe('warnMissing', () => {
    it.each([true, undefined])('outputs to console.warn by default', (warnMissing) => {
      // Arrange
      const fluent = createFluentVue({
        bundles: [bundle],
        warnMissing,
      })

      const component = {
        template: '<div>{{ $t("message-not-found") }}</div>',
      }

      const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})

      // Act
      const mounted = mountWithFluent(fluent, component)

      // Assert
      expect(mounted.html()).toEqual('<div>message-not-found</div>')
      expect(warn).toHaveBeenCalledTimes(1)
      expect(warn).toHaveBeenCalledWith('[fluent-vue] Could not find translation for key [message-not-found]')

      // Cleanup
      warn.mockRestore()
    })

    it('can be disabled', () => {
      // Arrange
      const fluent = createFluentVue({
        bundles: [bundle],
        warnMissing: false,
      })

      // Arrange
      const component = {
        template: '<div>{{ $t("missing-key") }}</div>',
      }

      const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})

      // Act
      const mounted = mountWithFluent(fluent, component)

      // Assert
      expect(mounted.html()).toEqual('<div>missing-key</div>')

      expect(warn).not.toHaveBeenCalled()

      // Cleanup
      warn.mockRestore()
    })

    it('can be a custom function', () => {
      // Arrange
      const warnMissing = vi.fn()

      const fluent = createFluentVue({
        bundles: [bundle],
        warnMissing,
      })

      // Arrange
      const component = {
        template: '<div>{{ $t("missing-key") }}</div>',
      }

      const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})

      // Act
      const mounted = mountWithFluent(fluent, component)

      // Assert
      expect(mounted.html()).toEqual('<div>missing-key</div>')

      expect(warnMissing).toHaveBeenCalledTimes(1)
      expect(warnMissing).toHaveBeenCalledWith('missing-key')

      expect(warn).not.toHaveBeenCalled()

      // Cleanup
      warnMissing.mockRestore()
      warn.mockRestore()
    })
  })
})
