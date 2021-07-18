import { join } from 'path'

import { rollup, RollupOptions } from 'rollup'
import vue from 'rollup-plugin-vue'

import fluentPlugin from '../src'

process.chdir(join(__dirname, 'fixtures'))

const testBundle = async (options: RollupOptions): Promise<string> => {
  const bundle = await rollup({
    ...options,
    external: ['vue', '@fluent/bundle']
  })

  const { output } = await bundle.generate({ format: 'cjs', exports: 'auto' })
  const [{ code }] = output
  return code
}

describe('rollup plugin', () => {
  test('generates custom block code', async () => {
    // Arrange
    // Act
    const code = await testBundle({
      input: 'test.vue',
      plugins: [
        vue({
          customBlocks: ['fluent']
        }),
        fluentPlugin()
      ]
    })

    // Assert
    expect(code).toMatchSnapshot()
  })

  test('custom blockType', async () => {
    // Arrange
    // Act
    const code = await testBundle({
      input: 'blockType.vue',
      plugins: [
        vue({
          customBlocks: ['i18n']
        }), fluentPlugin({
          blockType: 'i18n'
        })
      ],
      external: ['vue', '@fluent/bundle']
    })

    // Assert
    expect(code).toMatchSnapshot()
  })

  test('errors with no locale attr', async () => {
    // Arrange
    const func = async (): Promise<string> => await testBundle({
      input: 'noLocale.vue',
      plugins: [
        vue({
          customBlocks: ['fluent']
        }),
        fluentPlugin()
      ],
      external: ['vue', '@fluent/bundle']
    })

    // Act
    // Assert
    await expect(func).rejects.toThrowErrorMatchingSnapshot()
  })
})
