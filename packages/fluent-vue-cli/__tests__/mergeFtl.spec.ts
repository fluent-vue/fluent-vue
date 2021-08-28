import { mergeFtl } from '../src'

describe('mergeFtl', () => {
  it('adds new key/values', () => {
    // Arrange
    const source = `
user-name = World
aria-key = Aria value
greeting = Hello, {$name}
  .aria-label = Label value
`
    const newTranslation = { hello: 'Hello' }

    // Act
    const newSource = mergeFtl(source, newTranslation)

    // Assert
    expect(newSource).toMatchInlineSnapshot(`
"user-name = World
aria-key = Aria value
greeting = Hello, { $name }
    .aria-label = Label value
hello = Hello
"
`)
  })

  it('preserves comments', () => {
    // Arrange
    const source = `
## Group comment

# Inline comment
user-name = World
aria-key = Aria value
greeting = Hello, {$name}
  .aria-label = Label value
`
    const newTranslation = { 'user-name': 'John Doe' }

    // Act
    const newSource = mergeFtl(source, newTranslation)

    // Assert
    expect(newSource).toMatchInlineSnapshot(`
"## Group comment

# Inline comment
user-name = John Doe
aria-key = Aria value
greeting = Hello, { $name }
    .aria-label = Label value
"
`)
  })

  it('changes value if key is already present', () => {
    // Arrange
    const source = `
user-name = World
aria-key = Aria value
greeting = Hello, {$name}
  .aria-label = Label value
`

    const existingTranslation = { 'user-name': 'Jorn Doe' }

    // Act
    const newSource = mergeFtl(source, existingTranslation)

    // Assert
    expect(newSource).toMatchInlineSnapshot(`
"user-name = Jorn Doe
aria-key = Aria value
greeting = Hello, { $name }
    .aria-label = Label value
"
`)
  })
})
