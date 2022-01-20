import { describe, expect, it } from 'vitest'

import { isReactive } from 'vue-demi'
import { FluentBundle } from '@fluent/bundle'

import { createFluentVue } from '../src'

describe('performance checks', () => {
  it('bundles are not deeply reactive', () => {
    // Arrange
    const bundle = new FluentBundle('en-US')

    // Act
    const fluent = createFluentVue({
      bundles: [bundle],
    })

    // Assert
    for (const bundle of fluent.bundles)
      expect(isReactive(bundle)).toEqual(false)
  })
})
