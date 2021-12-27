import { defineConfig } from 'vite'

export default defineConfig({
  test: {
    coverage: {
      reporter: ['text', 'lcovonly']
    },
    environment: 'jsdom'
  }
})
