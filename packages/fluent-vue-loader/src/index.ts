import { loader } from 'webpack'
import { parseQuery, OptionObject } from 'loader-utils'
import { RawSourceMap } from 'source-map'

const loader: loader.Loader = function (
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
  const data = convert(source)

  return `
import { FluentResource } from '@fluent/bundle'

export default function (Component) {
  Component.options.__fluent = Component.options.__fluent || {}
  Component.options.__fluent['${query.locale}'] = new FluentResource(\`${data}\`)
}\n`
}

function convert(source: string | Buffer): string {
  const value = Buffer.isBuffer(source) ? source.toString() : source

  return value
}

export default loader
