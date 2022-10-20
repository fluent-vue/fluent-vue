import { defineConfig } from 'tsup'
import GlobalsPlugin from 'esbuild-plugin-globals'

const common = defineConfig({
  target: 'node12',
  outExtension: ({ format }) => {
    if (format === 'iife')
      return { js: '.global.js' }

    if (format === 'cjs')
      return { js: '.cjs' }

    if (format === 'esm')
      return { js: '.mjs' }

    return { js: '.js' }
  },
  globalName: 'FluentVue',
  splitting: true,
  esbuildPlugins: [
    GlobalsPlugin({
      'vue-demi': 'VueDemi',
      '@fluent/bundle': 'FluentBundle',
    }),
  ],
  external: ['vue-demi', '@fluent/bundle'],
})

const dev = defineConfig({
  outDir: 'dist/',
  env: {
    NODE_ENV: 'development',
  },
})

const prod = defineConfig({
  outDir: 'dist/prod',
  env: {
    NODE_ENV: 'production',
  },
  minify: true,
})

export default defineConfig([{
  ...common,
  entry: ['src/index.ts', 'src/composition.ts'],
  format: ['esm', 'cjs'],
  dts: true,
  ...dev,
},
{
  ...common,
  entry: ['src/index.ts', 'src/composition.ts'],
  format: ['esm', 'cjs'],
  ...prod,
},
{
  ...common,
  entry: ['src/index.ts'],
  format: 'iife',
  ...dev,
},
{
  ...common,
  entry: ['src/index.ts'],
  format: 'iife',
  ...prod,
}])
