import { beforeEach, describe, expect, it } from 'vitest'

import { FluentBundle, FluentResource } from '@fluent/bundle'
import ftl from '@fluent/dedent'

import { mountWithFluent } from '../utils'

import type { FluentVue } from '../../src'
import { createFluentVue, useFluent } from '../../src'

describe('composition api', () => {
  let fluent: FluentVue
  let bundleEn: FluentBundle

  beforeEach(() => {
    bundleEn = new FluentBundle('en')
    bundleEn.addResource(
      new FluentResource(ftl`
      link = link text
        .aria-label = Aria label
      `),
    )

    fluent = createFluentVue({
      bundles: [bundleEn],
    })
  })

  it('can be used in setup', () => {
    // Arrange
    const component = {
      template: '<a href="/foo" v-bind="attrs">{{ text }}</a>',
      setup() {
        const { $t, $ta } = useFluent()

        return {
          attrs: $ta('link'),
          text: $t('link'),
        }
      },
    }

    // Act
    const mounted = mountWithFluent(fluent, component)

    // Assert
    expect(mounted.html()).toEqual('<a href="/foo" aria-label="Aria label">link text</a>')
  })

  it('thrpws when used outside of setup', () => {
    // Arrange
    // Act
    const use = () => useFluent()

    // Assert
    expect(use).toThrowError('[fluent-vue] useFluent called outside of setup')
  })

  it('throws when used without installing plugin', () => {
    // Arrange
    const component = {
      template: '<span></span>',
      setup() {
        useFluent()
      },
    }

    // Act
    const mount = () => mountWithFluent(null, component)

    // Asser
    expect(mount).toThrowError('[fluent-vue] useFluent called without installing plugin')
  })
})
