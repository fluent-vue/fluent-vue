// #region Vue 2
declare module 'vue/types/vue' {
  interface Vue {
    $t: (key: string, values?: Record<string, unknown>) => string
    $ta: (key: string, values?: Record<string, unknown>) => Record<string, string>
  }
}
// #endregion

// #region Vue 3
declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $t: (key: string, values?: Record<string, unknown>) => string
    $ta: (key: string, values?: Record<string, unknown>) => Record<string, string>
  }
}
// #endregion

export * from './dist'
