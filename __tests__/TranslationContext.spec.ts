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

  it('should format a message with custom types', () => {
    const bundle = new FluentBundle('en-US', { useIsolating: false })
    bundle.addResource(new FluentResource('hello = Hello {$name} you have {$count} items'))

    class CustomCounter {
      constructor(public count: number) {}
    }

    const context = new TranslationContext(ref([bundle]), {
      warnMissing: vi.fn(),
      parseMarkup: vi.fn(),
      mapVariable: (variable) => {
        if (variable instanceof CustomCounter)
          return variable.count
      },
    })
    expect(context.format('hello', { name: 'John', count: new CustomCounter(5) })).toBe('Hello John you have 5 items')
  })
})
