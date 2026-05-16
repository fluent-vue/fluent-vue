import type { FluentVue } from '../src'

import { FluentBundle, FluentResource } from '@fluent/bundle'

import { beforeEach, describe, expect, it } from 'vitest'
import { createFluentVue } from '../src'

describe('mergedWith', () => {
  let bundleEn: FluentBundle
  let bundleUk: FluentBundle

  let fluent: FluentVue

  beforeEach(() => {
    bundleEn = new FluentBundle('en')
    bundleUk = new FluentBundle('uk')

    fluent = createFluentVue({
      bundles: [bundleEn, bundleUk],
    })
  })

  it('returns global translations', () => {
    // Arrange
    bundleEn.addResource(new FluentResource('hello = Hello, World!'))

    // Act
    const { $t } = fluent.mergedWith({ en: new FluentResource('hello-two = Hello, World!') })
    const translation = $t('hello')

    // Assert
    expect(translation).toEqual('Hello, World!')
  })

  it('returns merged translation', () => {
    // Arrange
    bundleEn.addResource(new FluentResource('hello = Hello, World!'))

    // Act
    const { $t } = fluent.mergedWith({ en: new FluentResource('hello-two = Hello, World merged!') })
    const translation = $t('hello-two')

    // Assert
    expect(translation).toEqual('Hello, World merged!')
  })

  it('returns overridden global translations', () => {
    // Arrange
    bundleEn.addResource(new FluentResource('hello = Hello, World!'))

    // Act
    const { $t } = fluent.mergedWith({ en: new FluentResource('hello = Hello, World overridden!') })
    const translation = $t('hello')

    // Assert
    expect(translation).toEqual('Hello, World overridden!')
  })

  it('falls back to the next bundle', () => {
    // Arrange
    bundleEn.addResource(new FluentResource('hello = Hello, World!'))

    // Act
    const { $t } = fluent.mergedWith({ uk: new FluentResource('hello-two = Привіт, Світ!') })
    const translation = $t('hello-two')

    // Assert
    expect(translation).toEqual('Привіт, Світ!')
  })
})
