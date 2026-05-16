export interface VueQuery {
  vue?: boolean
  type?: 'script' | 'template' | 'style' | 'custom' | 'fluent'
  blockType?: string
  index?: number
  locale?: string
}

export function parseVueRequest(id: string) {
  const [filename, rawQuery] = id.split('?', 2)
  const params = new URLSearchParams(rawQuery)
  const ret: VueQuery = {}

  ret.vue = params.has('vue')

  if (params.has('type'))
    ret.type = params.get('type') as VueQuery['type']

  if (params.has('blockType'))
    ret.blockType = params.get('blockType') ?? undefined

  if (params.has('index'))
    ret.index = Number(params.get('index'))

  if (params.has('locale'))
    ret.locale = params.get('locale') ?? undefined

  return {
    filename,
    query: ret,
  }
}

export function isCustomBlock(query: VueQuery, options: { blockType: string }): boolean {
  return (
    'vue' in query
    && (query.type === 'custom' // for vite (@vite-plugin-vue)
      || query.type === options.blockType // for webpack (vue-loader)
      || query.blockType === options.blockType) // for webpack (vue-loader)
  )
}
