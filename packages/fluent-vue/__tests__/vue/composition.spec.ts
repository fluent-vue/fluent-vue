/**
 * @jest-environment jsdom
 */

import { FluentBundle, FluentResource } from '@fluent/bundle'
import ftl from '@fluent/dedent'

import { mountWithFluent } from '../utils'

import { createFluentVue, FluentVue, useFluent } from '../../src'

describe('composition api', () => {
  let fluent: FluentVue
  let bundleEn: FluentBundle

  beforeEach(() => {
    bundleEn = new FluentBundle('en')
    bundleEn.addResource(
      new FluentResource(ftl`
      link = link text
        .aria-label = Aria label
      `)
    )

    fluent = createFluentVue({
      locale: ['en'],
      bundles: [bundleEn]
    })
  })

  it('can be used in setup', () => {
    // Arrange
    const component = {
      template: '<a href="/foo" v-bind="attrs">{{ text }}</a>',
      setup () {
        const { $t, $ta } = useFluent()

        return {
          attrs: $ta('link'),
          text: $t('link')
        }
      }
    }

    // Act
    const mounted = mountWithFluent(fluent, component)

    // Assert
    expect(mounted.html()).toEqual('<a href="/foo" aria-label="Aria label">link text</a>')
  })
})
