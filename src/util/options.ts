import type { FluentVueOptions, ResolvedOptions, SimpleNode } from 'src/types'

import { assert, warn } from './warn'

function defaultMarkupParser(value: string): SimpleNode[] {
  assert(typeof DOMParser !== 'undefined', 'DOMParser is not available. Please provide a custom parseMarkup function.')

  const parser = new DOMParser()
  const doc = parser.parseFromString(value, 'text/html')
  const nodes = Array.from(doc.body.childNodes)

  return nodes
}

function defaultWarnMissing(key: string) {
  warn(`Could not find translation for key [${key}]`)
}

function getWarnMissing(options: FluentVueOptions) {
  if (options.warnMissing === true || options.warnMissing == null)
    return defaultWarnMissing
  else if (options.warnMissing === false)
    return () => {}
  else
    return options.warnMissing
}

export function resolveOptions(options: FluentVueOptions): ResolvedOptions {
  return {
    warnMissing: getWarnMissing(options),
    parseMarkup: options.parseMarkup ?? defaultMarkupParser,
    globalFormatName: options.globals?.functions?.format ?? '$t',
    globalFormatAttrsName: options.globals?.functions?.formatAttrs ?? '$ta',
    directiveName: options.globals?.directive ?? 't',
    componentName: options.globals?.component ?? 'i18n',
    tag: options.tag ?? 'span',
  }
}
