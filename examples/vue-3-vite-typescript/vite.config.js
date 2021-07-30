import vue from '@vitejs/plugin-vue'
import fluentPlugin from 'rollup-plugin-fluent-vue'

export default {
  plugins: [vue(), fluentPlugin()]
}
