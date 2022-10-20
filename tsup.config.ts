import { defineConfig } from 'tsup'
import GlobalsPlugin from 'esbuild-plugin-globals'

const common = defineConfig({
  entry: ['src/index.ts', 'src/composition.ts'],
  format: ['esm', 'cjs', 'iife'],
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

export default defineConfig([{
  ...common,
  outDir: 'dist/',
  dts: true,
  env: {
    NODE_ENV: 'development',
  },
},
{
  ...common,
  outDir: 'dist/prod',
  env: {
    NODE_ENV: 'production',
  },
  minify: true,
}])
