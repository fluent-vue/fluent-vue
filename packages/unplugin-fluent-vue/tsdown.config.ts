import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: [
    './src/index.ts',
    './src/webpack.ts',
    './src/vite.ts',
    './src/rollup.ts',
    './src/nuxt.ts',
  ],
  deps: {
    neverBundle: ['@nuxt/schema'],
  },
  format: 'esm',
  outDir: 'dist',
  dts: true,
  clean: true,
  sourcemap: true,
})
