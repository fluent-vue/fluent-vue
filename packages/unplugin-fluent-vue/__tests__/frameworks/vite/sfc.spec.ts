import vue3 from '@vitejs/plugin-vue'

import compiler from '@vue/compiler-sfc'

import { describe, expect, it } from 'vitest'
import { SFCFluentPlugin } from '../../../src/vite'
import { compile } from './util'

describe('Vite SFC', () => {
  it('generates custom block code', async () => {
    // Arrange
    // Act
    const code = await compile({
      plugins: [
        vue3({
          compiler,
        }),
        SFCFluentPlugin(),
      ],
    }, '/fixtures/test.vue')

    // Assert
    expect(code).toMatchSnapshot()
  })

  describe('parseFtl', () => {
    it('parses ftl syntax during compilation', async () => {
      // Arrange
      // Act
      const code = await compile({
        plugins: [
          vue3({
            compiler,
          }),
          SFCFluentPlugin({
            parseFtl: true,
            checkSyntax: false,
          }),
        ],
      }, '/fixtures/test.vue')

      // Assert
      expect(code).toMatchSnapshot()
    })

    it('generates block code even if it has errors', async () => {
      // Arrange
      // Act
      const code = await compile({
        plugins: [
          vue3({
            compiler,
          }),
          SFCFluentPlugin({
            parseFtl: true,
            checkSyntax: false,
          }),
        ],
      }, '/fixtures/errors.vue')

      // Assert
      expect(code).toMatchSnapshot()
    })
  })

  it('supports custom blockType', async () => {
    // Arrange
    // Act
    const code = await compile({
      plugins: [
        vue3({
          compiler,
        }),
        SFCFluentPlugin({
          blockType: 'i18n',
        }),
      ],
    }, '/fixtures/blockType.vue')

    // Assert
    expect(code).toMatchSnapshot()
  })
})
