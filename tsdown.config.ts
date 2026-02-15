import type { UserConfig } from 'tsdown'
import { defineConfig } from 'tsdown'

const shared: UserConfig = {
  target: 'node22',
  external: ['vue-demi', '@fluent/bundle', '@vue/devtools-api'],
  skipNodeModulesBundle: true,
  outDir: 'dist',
}

export default defineConfig([
  // Dev: ESM + CJS
  {
    ...shared,
    entry: ['src/index.ts', 'src/composition.ts'],
    format: ['esm', 'cjs'],
    dts: true,
  },
  // Prod: ESM + CJS
  {
    ...shared,
    entry: ['src/index.ts', 'src/composition.ts'],
    format: ['esm', 'cjs'],
    env: {
      NODE_ENV: 'production',
    },
    outDir: 'dist/prod',
  },
  // Prod: IIFE (browser bundle)
  {
    ...shared,
    entry: ['src/index.ts'],
    format: ['iife'],
    globalName: 'FluentVue',
    skipNodeModulesBundle: false,
    noExternal: ['@fluent/sequence', 'cached-iterable'],
    inlineOnly: false,
    outputOptions: {
      globals: {
        'vue-demi': 'VueDemi',
        '@fluent/bundle': 'FluentBundle',
      },
    },
    env: {
      NODE_ENV: 'production',
    },
  },
])
