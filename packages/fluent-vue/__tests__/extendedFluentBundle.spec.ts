import { ExtendedFluentBundle } from '../src/extendedFluentBundle'
import { FluentBundle, FluentResource } from '@fluent/bundle'
import ftl from '@fluent/dedent'
import { Pattern } from '@fluent/bundle/esm/ast'

describe('ExtendedFluentBundle', () => {
  it('gets options from parent', () => {
    // Arrange
    const functions = {
      test: () => '',
    }
    const transform = () => ''

    const parent = new FluentBundle('en', {
      useIsolating: false,
      functions,
      transform,
    })

    // Act
    const bundle = new ExtendedFluentBundle(parent, 'en')

    // Assert
    expect(bundle._useIsolating).toEqual(false)
    expect(bundle._functions).toEqual(parent._functions)
    expect(bundle._transform).toEqual(parent._transform)
  })

  it('can access own messages', () => {
    // Arrange
    const parent = new FluentBundle('en')
    const bundle = new ExtendedFluentBundle(parent, 'en')
    const resource = new FluentResource(ftl`
    message = Localized
    `)
    bundle.addResource(resource)

    // Assert
    const message = bundle.getMessage('message')
    expect(message).not.toBeUndefined()

    const localized = bundle.formatPattern(message?.value as Pattern)
    expect(localized).toEqual('Localized')
  })

  it('can access parent messages', () => {
    // Arrange
    const parent = new FluentBundle('en')
    const resource = new FluentResource(ftl`
    message = Localized
    `)
    parent.addResource(resource)
    const bundle = new ExtendedFluentBundle(parent, 'en')

    // Assert
    const message = bundle.getMessage('message')
    expect(message).not.toBeUndefined()

    const localized = bundle.formatPattern(message?.value as Pattern)
    expect(localized).toEqual('Localized')
  })

  it('can override parent messages', () => {
    // Arrange
    const parent = new FluentBundle('en')
    const parentResource = new FluentResource(ftl`
    message = Localized parent
    `)
    parent.addResource(parentResource)
    const bundle = new ExtendedFluentBundle(parent, 'en')
    const resource = new FluentResource(ftl`
    message = Localized child
    `)
    bundle.addResource(resource)

    // Assert
    const message = bundle.getMessage('message')
    expect(message).not.toBeUndefined()

    const localized = bundle.formatPattern(message?.value as Pattern)
    expect(localized).toEqual('Localized child')
  })

  it('can reference parent terms', () => {
    // Arrange
    const parent = new FluentBundle('en')
    const parentResource = new FluentResource(ftl`
    -parent-term = Parent term
    `)
    parent.addResource(parentResource)
    const bundle = new ExtendedFluentBundle(parent, 'en')
    const resource = new FluentResource(ftl`
    message = Localized { -parent-term }
    `)
    bundle.addResource(resource)

    // Assert
    const message = bundle.getMessage('message')
    expect(message).not.toBeUndefined()

    const localized = bundle.formatPattern(message?.value as Pattern)
    expect(localized).toEqual('Localized Parent term')
  })
})
