import type { CustomVariableTypes } from '../src'
import { FluentBundle, FluentResource } from '@fluent/bundle'
import ftl from '@fluent/dedent'
import { describe, expect, expectTypeOf, it } from 'vitest'
import { createFluentVue } from '../src'

class Temperature {
  constructor(public celsius: number) {}
}

class Weather {
  constructor(public code: string) {}
}

declare module '../src' {
  export interface TypesConfig {
    customVariableTypes: Temperature
  }
}

/**
 * Tests for CustomVariableTypes type extraction and custom variable types support
 */
describe('customVariableTypes', () => {
  describe('type extraction', () => {
    it('should extract CustomVariableTypes from TypesConfigy', () => {
      expectTypeOf<CustomVariableTypes>().toEqualTypeOf<Temperature>()
    })
  })

  describe('runtime behavior with custom variable types', () => {
    it('should support multiple custom variable types', () => {
      const bundle = new FluentBundle('en-US', { useIsolating: false })
      bundle.addResource(
        new FluentResource(ftl`
        weather = Weather in {$city}: {$temp} and {$weather}
        `),
      )

      const fluent = createFluentVue({
        bundles: [bundle],
        mapVariable: (variable) => {
          if (variable instanceof Temperature)
            return `${variable.celsius}°C`
          if (variable instanceof Weather)
            return variable.code
        },
      })

      const result = fluent.format('weather', {
        city: 'Paris',
        temp: new Temperature(22),
        // This should be an error. But there is a bug in fluent.js types:
        // https://github.com/projectfluent/fluent.js/pull/649
        // ts-expect-error This type is not defined as supported
        weather: new Weather('sunny'),
      })

      expect(result).toBe('Weather in Paris: 22°C and sunny')
    })
  })
})
