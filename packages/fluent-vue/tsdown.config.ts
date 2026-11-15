import type { UserConfig } from 'tsdown'
import { defineConfig } from 'tsdown'

const shared: UserConfig = {
  target: 'node22',
  external: ['vue', '@fluent/bundle', '@vue/devtools-api'],
  outDir: 'dist',
}

export default defineConfig([
  {
    ...shared,
    entry: 'src/index.ts',
    format: 'esm',
    dts: true,
  },
  {
    ...shared,
    entry: ['src/index.ts'],
    format: ['iife'],
    globalName: 'FluentVue',
    noExternal: ['@fluent/sequence', 'cached-iterable'],
    outputOptions: {
      globals: {
        'vue': 'Vue',
        '@fluent/bundle': 'FluentBundle',
      },
    },
    env: {
      NODE_ENV: 'production',
    },
  },
])
