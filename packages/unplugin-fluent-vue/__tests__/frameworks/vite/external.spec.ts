import { relative, resolve } from 'node:path'
import vue3 from '@vitejs/plugin-vue'

import compiler from '@vue/compiler-sfc'
import { describe, expect, it } from 'vitest'

import { ExternalFluentPlugin } from '../../../src/vite'
import { compile } from './util'

const baseDir = resolve(__dirname, '../..')

describe('Vite external', () => {
  it('works', async () => {
    // Arrange
    // Act
    const code = await compile({
      plugins: [
        vue3({
          compiler,
        }),
        ExternalFluentPlugin({
          baseDir: resolve(baseDir, 'fixtures'),
          ftlDir: resolve(baseDir, 'fixtures/ftl'),
          locales: ['en', 'da'],
        }),
      ],
    }, '/fixtures/components/external.vue')

    // Assert
    expect(code).toContain('external.vue.ftl')
    expect(code).toMatchSnapshot()
  })

  it('getFtlPath', async () => {
    // Arrange
    // Act
    const code = await compile({
      plugins: [
        vue3({
          compiler,
        }),
        ExternalFluentPlugin({
          getFtlPath: (locale, vuePath) => {
            return `${baseDir}/fixtures/ftl/${locale}/${relative(resolve(baseDir, 'fixtures'), vuePath)}.ftl`
          },
          locales: ['en', 'da'],
        }),
      ],
    }, '/fixtures/components/external.vue')

    // Assert
    expect(code).toContain('external.vue.ftl')
    expect(code).toMatchSnapshot()
  })

  it('works with script setup', async () => {
    // Arrange
    // Act
    const code = await compile({
      plugins: [
        vue3({
          compiler,
        }),
        ExternalFluentPlugin({
          baseDir: resolve(baseDir, 'fixtures'),
          ftlDir: resolve(baseDir, 'fixtures/ftl'),
          locales: ['en', 'da'],
        }),
      ],
    }, '/fixtures/components/external.setup.vue')

    // Assert
    expect(code).toContain('external.setup.vue.ftl')
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
          ExternalFluentPlugin({
            baseDir: resolve(baseDir, 'fixtures'),
            ftlDir: resolve(baseDir, 'fixtures/ftl'),
            locales: ['en', 'da'],
            parseFtl: true,
          }),
        ],
      }, '/fixtures/components/external.vue')

      // Assert
      expect(code).toMatchSnapshot()
    })
  })

  it('virtual:ftl-for-file', async () => {
    // Arrange
    // Act
    const code = await compile({
      plugins: [
        vue3({
          compiler,
        }),
        ExternalFluentPlugin({
          baseDir: resolve(baseDir, 'fixtures'),
          ftlDir: resolve(baseDir, 'fixtures/ftl'),
          locales: ['en', 'da'],
        }),
      ],
    }, '/fixtures/importer.js')

    // Assert
    expect(code).toMatchInlineSnapshot(`
      "=== /fixtures/importer.js ===
      import translations from "/@id/virtual:ftl-for-file?importer=/fixtures/importer.js"

      // eslint-disable-next-line no-console -- this is a test file
      console.log(translations)


      === virtual:ftl-for-file?importer=/fixtures/importer.js ===
      import en_ftl from "/fixtures/ftl/en/importer.js.ftl?import";
      import da_ftl from "/fixtures/ftl/da/importer.js.ftl?import";
      export default { 'en': en_ftl, 'da': da_ftl }
      "
    `)
  })

  it('can import FTL files', async () => {
    // Arrange
    // Act
    const code = await compile({
      plugins: [
        vue3({
          compiler,
        }),
        ExternalFluentPlugin({
          baseDir: resolve(baseDir, 'fixtures'),
          ftlDir: resolve(baseDir, 'fixtures/ftl'),
          locales: ['en', 'da'],
        }),
      ],
    }, '/fixtures/ftl/en/importer.js.ftl')

    // Assert
    expect(code).toMatchInlineSnapshot(`
      "=== /fixtures/ftl/en/importer.js.ftl ===

      import { FluentResource } from "/@id/virtual:empty:fluent-bundle"

      export default /*#__PURE__*/ new FluentResource("key = Translations for js file")
      "
    `)
  })

  it('can parse FTL files', async () => {
    // Arrange
    // Act
    const code = await compile({
      plugins: [
        vue3({
          compiler,
        }),
        ExternalFluentPlugin({
          baseDir: resolve(baseDir, 'fixtures'),
          ftlDir: resolve(baseDir, 'fixtures/ftl'),
          locales: ['en', 'da'],
          parseFtl: true,
        }),
      ],
    }, '/fixtures/ftl/en/importer.js.ftl')

    // Assert
    expect(code).toMatchInlineSnapshot(`
      "=== /fixtures/ftl/en/importer.js.ftl ===

      export default {"body":[{"id":"key","value":"Translations for js file","attributes":{}}]}
      "
    `)
  })
})
