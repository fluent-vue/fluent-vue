import { FluentBundle, FluentResource } from '@fluent/bundle'
import ftl from '@fluent/dedent'

describe('fluent', () => {
  const bundle = new FluentBundle('en-US', {
    useIsolating: false
  })

  it('simple case works', () => {
    // Arrange
    const errors = bundle.addResource(
      new FluentResource(ftl`
      -brand-name = Foo 3000
      welcome = Welcome, { $name }, to { -brand-name }!
      `)
    )
    const helloUser = bundle.getMessage('welcome') as any

    // Act
    const message = bundle.formatPattern(helloUser.value, { name: 'John' })

    // Assert
    expect(errors).toEqual([])
    expect(message).toEqual('Welcome, John, to Foo 3000!')
  })

  it('complex case works', () => {
    // Arrange
    const errors = bundle.addResource(
      new FluentResource(ftl`
      shared-photos =
        { $userName } { $photoCount ->
            [one] added a new photo
          *[other] added { $photoCount } new photos
        } to { $userGender ->
            [male] his stream
            [female] her stream
          *[other] their stream
        }.
      `)
    )
    const sharedPhotos = bundle.getMessage('shared-photos') as any

    // Act
    const message = bundle.formatPattern(sharedPhotos.value, {
      userName: 'John',
      photoCount: 1,
      userGender: 'male'
    })

    // Assert
    expect(errors).toEqual([])
    expect(message).toEqual('John added a new photo to his stream.')
  })
})
