import vue from '@vitejs/plugin-vue'
import { SFCFluentPlugin } from 'unplugin-fluent-vue/vite'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [
    vue(),
    SFCFluentPlugin(),
  ],
})
