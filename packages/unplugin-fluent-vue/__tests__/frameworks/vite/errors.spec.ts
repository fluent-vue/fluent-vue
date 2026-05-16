import { resolve } from 'node:path'
import vue3 from '@vitejs/plugin-vue'

import compiler from '@vue/compiler-sfc'
import { describe, expect, it } from 'vitest'

import { ExternalFluentPlugin, SFCFluentPlugin } from '../../../src/vite'
import { compile } from './util'

const baseDir = resolve(__dirname, '../..')

describe('error checking', () => {
  it('checks for syntax errors in external ftl files', async () => {
    // Arrange
    // Act
    const code = compile({
      plugins: [
        vue3({
          compiler,
        }),
        ExternalFluentPlugin({
          baseDir: resolve(baseDir, 'fixtures'),
          ftlDir: resolve(baseDir, 'fixtures/ftl'),
          locales: ['en', 'da'],
          checkSyntax: true,
        }),
      ],
    }, '/fixtures/components/errors.vue')

    // Assert
    await expect(code).rejects.toThrowErrorMatchingInlineSnapshot(`
      [Error: Fluent parse errors:
          E0003: Expected token: "}" (2:31)
      1 |  # Simple things are simple.
      2 |  hello-user = Hello, {$userName!
        |                                ^
      3 |  
      4 |  # Complex things are possible.
          E0010: Expected one of the variants to be marked as default (*) (9:3)
      7  |      [one] added one photo
      8  |      [other] added {$photoCount} new photo
      9  |    }to {$userGender ->
         |    ^
      10 |      [male] his stream
      11 |      [female] her stream]
    `)
  })

  it('checks for syntax errors in custom blocks', async () => {
    // Arrange
    // Act
    const code = compile({
      plugins: [
        vue3({
          compiler,
        }),
        SFCFluentPlugin({
          checkSyntax: true,
        }),
      ],
    }, '/fixtures/errors.vue')

    // Assert
    await expect(code).rejects.toThrowErrorMatchingInlineSnapshot(`
      [Error: Fluent parse errors:
          E0003: Expected token: "}" (2:31)
      1 |  # Simple things are simple.
      2 |  hello-user = Hello, {$userName!
        |                                ^
      3 |  
      4 |  # Complex things are possible.
          E0010: Expected one of the variants to be marked as default (*) (9:3)
      7  |      [one] added one photo
      8  |      [other] added {$photoCount} new photo
      9  |    }to {$userGender ->
         |    ^
      10 |      [male] his stream
      11 |      [female] her stream]
    `)
  })
})
