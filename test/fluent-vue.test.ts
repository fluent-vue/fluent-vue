import { bundle, ftl } from '../src/fluent-vue'

describe('fluent', () => {
  it('simple case works', () => {
    // Arrange
    const errors = bundle.addMessages(ftl`
      -brand-name = Foo 3000
      welcome = Welcome, { $name }, to { -brand-name }!
    `)
    const helloUser = bundle.getMessage('welcome')

    // Act
    const message = bundle.format(helloUser, { name: 'John' })

    // Assert
    expect(errors).toEqual([])
    expect(message).toEqual('Welcome, John, to Foo 3000!')
  })

  it('complex case works', () => {
    // Arrange
    const errors = bundle.addMessages(ftl`
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
    const sharedPhotos = bundle.getMessage('shared-photos')

    // Act
    const message = bundle.format(sharedPhotos, {
      userName: 'John',
      photoCount: 1,
      userGender: 'male'
    })

    // Assert
    expect(errors).toEqual([])
    expect(message).toEqual('John added a new photo to his stream.')
  })
})
