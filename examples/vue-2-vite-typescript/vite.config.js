import { createVuePlugin } from 'vite-plugin-vue2'
import fluentPlugin from 'rollup-plugin-fluent-vue'

export default {
  plugins: [createVuePlugin(), fluentPlugin({ vue: '2' })]
}
