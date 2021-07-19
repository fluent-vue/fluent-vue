import compiler from './compiler'

test('Inserts name and outputs JavaScript', async () => {
  // Arrange
  // Act
  const stats = await compiler('fixtures/test.vue')

  // Assert
  const ftlModules = stats.toJson({ source: true }).modules
    ?.filter(module =>
      module.name?.includes('blockType=fluent') === true &&
      module.issuerName?.includes('blockType=fluent') === true)
    .map(module => module.source)

  expect(ftlModules).not.toBeUndefined()
  expect(ftlModules).toHaveLength(1)
  expect(ftlModules).toMatchSnapshot()
})
