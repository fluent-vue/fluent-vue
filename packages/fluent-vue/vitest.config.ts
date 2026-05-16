import { defineConfig } from 'vitest/config'

export default defineConfig({
  define: {
    'process.env.NODE_ENV': '\'test\'',
  },
  test: {
    include: [
      '__tests__/**/*.spec.ts',
    ],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcovonly'],
      include: [
        'src/**',
      ],
    },
    environment: 'happy-dom',
  },
})
