import { getFtlMessages } from '../src'

describe('getVueMessages', () => {
  it('extracts messages from ftl file', async () => {
    // Arrange
    const source = `
user-name = World
aria-key = Aria value
greeting = Hello, {$name}
  .aria-label = Label value
`

    // Act
    const messages = getFtlMessages(source)

    // Assert
    expect(messages).toMatchInlineSnapshot(`
Object {
  "aria-key": "Aria value",
  "greeting": "Hello, { $name }
    .aria-label = Label value",
  "user-name": "World",
}
`)
  })

  it('ignores comments', async () => {
    // Arrange
    const source = `
## Group comment

# Inline comment
user-name = World
aria-key = Aria value
greeting = Hello, {$name}
  .aria-label = Label value
`

    // Act
    const messages = getFtlMessages(source)

    // Assert
    expect(messages).toMatchInlineSnapshot(`
Object {
  "aria-key": "Aria value",
  "greeting": "Hello, { $name }
    .aria-label = Label value",
  "user-name": "World",
}
`)
  })
})
