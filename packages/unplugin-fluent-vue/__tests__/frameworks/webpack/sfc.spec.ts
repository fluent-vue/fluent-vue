import { describe, expect, it } from 'vitest'

import { compile } from './util'

describe('Webpack SFC', () => {
  it('generates custom block code', async () => {
    // Arrange
    // Act
    const stats = await compile('fixtures/test.vue')

    // Assert
    const ftlModules = stats.toJson({ source: true }).modules?.filter(module => module.name?.includes('blockType=fluent') === true && !module.source.includes('unplugin-fluent-vue-sfc')).map(module => module.source)

    expect(ftlModules).not.toBeUndefined()
    expect(ftlModules).toHaveLength(1)
    expect(ftlModules).toMatchSnapshot()
  })

  it('includes HMR code only when HMR is enabled', async () => {
    // Arrange
    // Act
    const stats = await compile('fixtures/test.vue', {}, true)

    // Assert
    const ftlModules = stats.toJson({ source: true }).modules?.filter(module => module.name?.includes('blockType=fluent') === true && !module.source.includes('unplugin-fluent-vue-sfc')).map(module => module.source)

    expect(ftlModules).not.toBeUndefined()
    expect(ftlModules).toHaveLength(1)
    expect(ftlModules).toMatchSnapshot()
  })

  it('errors with no locale attr', async () => {
    // Arrange
    // Act
    // Assert
    await expect(() => compile('fixtures/noLocale.vue')).rejects.toContainEqual(
      expect.objectContaining({
        details: expect.stringContaining('Error: Custom block does not have locale attribute'),
      }),
    )
  })
})
