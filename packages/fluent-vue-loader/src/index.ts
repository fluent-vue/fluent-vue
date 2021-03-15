import { parseQuery, OptionObject } from 'loader-utils'
import { RawSourceMap } from 'source-map'

const loader = function (
  this: any,
  source: string | Buffer,
  sourceMap: RawSourceMap | undefined
): void {
  if (this.version && Number(this.version) >= 2) {
    try {
      this.cacheable && this.cacheable()
      this.callback(null, generateCode(source, parseQuery(this.resourceQuery)), sourceMap)
    } catch (err) {
      this.emitError(err.message)
      this.callback(err)
    }
  } else {
    const message = 'Webpack 2 is not supported'
    this.emitError(message)
    this.callback(new Error(message))
  }
}

function generateCode(source: string | Buffer, query: OptionObject): string {
  const rawData = convert(source)

  // vue-loader pads SFC file sections with newlines - trim those
  const data = rawData.replace(/^\n+|\n+$/g, '')

  return `
import { FluentResource } from '@fluent/bundle'

export default function (Component) {
  const target = Component.options || Component
  target.fluent = target.fluent || {}
  target.fluent['${query.locale}'] = new FluentResource(\`${data}\`)

  if (module.hot) {
    if (typeof __VUE_HMR_RUNTIME__ !== 'undefined' ) {
      // Vue 3
      const id = target.__hmrId
      const api = __VUE_HMR_RUNTIME__
      api.reload(id, target)
    } else {
      // Vue 2
      // There is no proper api to access HMR for component from custom block
      // so use this magic
      delete target._Ctor
    }
  }
}\n`
}

function convert(source: string | Buffer): string {
  const value = Buffer.isBuffer(source) ? source.toString() : source

  return value
}

export default loader
