import { FluentBundle, FluentResource } from '@fluent/bundle'
import { describe, expect, it, vi } from 'vitest'

import { ref } from 'vue-demi'

import { TranslationContext } from '../src/TranslationContext'

describe('translationContext', () => {
  it('should format a message', () => {
    const bundle = new FluentBundle('en-US', { useIsolating: false })
    bundle.addResource(new FluentResource('hello = Hello!'))

    const context = new TranslationContext(ref([bundle]), { warnMissing: vi.fn(), parseMarkup: vi.fn() })
    expect(context.format('hello')).toBe('Hello!')
  })

  it('should format a message with a value', () => {
    const bundle = new FluentBundle('en-US', { useIsolating: false })
    bundle.addResource(new FluentResource('hello = Hello {$name}!'))

    const context = new TranslationContext(ref([bundle]), { warnMissing: vi.fn(), parseMarkup: vi.fn() })
    expect(context.format('hello', { name: 'John' })).toBe('Hello John!')
  })

  it('should format a message with a value and custom types', () => {
    const bundle = new FluentBundle('en-US', { useIsolating: false })
    bundle.addResource(new FluentResource('hello = Hello {$name} it is {$date}!'))

    const context = new TranslationContext(ref([bundle]), {
      warnMissing: vi.fn(),
      parseMarkup: vi.fn(),
      mapVariable: (variable) => {
        if (variable instanceof Date)
          return variable.toLocaleDateString('en-UK')
      },
    })
    expect(context.format('hello', { name: 'John', date: new Date(0) })).toBe('Hello John it is 01/01/1970!')
  })
})
