import { describe, expect, it } from 'vitest'

import { isAttrNameLocalizable } from '../../src/vue/dom'

const namespaceURI = 'http://www.w3.org/1999/xhtml'

function createElement(name: string, attrs: any = {}): HTMLElement {
  const element = document.createElementNS(namespaceURI, name)
  for (const key in attrs)
    element.setAttribute(key, attrs[key])

  return element
}

describe('isAttrNameLocalizable', () => {
  it('returns true for localizable attributes', () => {
    // Arrange Act
    const result = isAttrNameLocalizable('alt', createElement('img'))

    // Assert
    expect(result).toBe(true)
  })

  it('returns false for non-localizable attributes', () => {
    // Arrange Act
    const result = isAttrNameLocalizable('src', createElement('img'))

    // Assert
    expect(result).toBe(false)
  })

  it('returns false for non-localizable attributes', () => {
    // Arrange Act
    const result = isAttrNameLocalizable('alt', createElement('div'))

    // Assert
    expect(result).toBe(false)
  })

  it('returns true for global attributes', () => {
    // Arrange Act
    const result = isAttrNameLocalizable('title', createElement('div'))

    // Assert
    expect(result).toBe(true)
  })

  it('returns true for explicitly allowed attributes', () => {
    // Arrange Act
    const result = isAttrNameLocalizable('data-alt', createElement('img'), ['data-alt'])

    // Assert
    expect(result).toBe(true)
  })

  it.each(['submit', 'reset', 'button'])('works with input type=%s value attribute', (type) => {
    // Arrange Act
    const result = isAttrNameLocalizable('value', createElement('input', { type }))

    // Assert
    expect(result).toBe(true)
  })
})
