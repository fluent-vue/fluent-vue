import { defineConfig } from 'vitest/config'

export default defineConfig({
  define: {
    'process.env.NODE_ENV': '\'test\'',
  },
  test: {
    include: [
      '__tests__/**/*.spec.ts',
    ],
    experimentalVmThreads: true,
    coverage: {
      provider: 'istanbul',
      reporter: ['text', 'lcovonly'],
    },
    environment: 'happy-dom',
  },
})
