import type { SourceMap } from 'magic-string'
import { FluentResource } from '@fluent/bundle'
import MagicString from 'magic-string'
import { getSyntaxErrors } from './parse'

type InjectFtlFn = (template: TemplateStringsArray, locale?: string, source?: string) => { code?: { code: string, map: SourceMap }, error?: string }

function normalize(str: string) {
  return str.replace(/\r\n/g, '\n').trim()
}

export function getInjectFtl(options: { checkSyntax: boolean, parseFtl: boolean }, addPureAnotation = false): InjectFtlFn {
  return (template, locale, source) => {
    if (source == null) {
      source = locale
      locale = undefined
    }

    const pureAnotation = addPureAnotation ? '/*#__PURE__*/ ' : ''

    if (source == null)
      throw new Error('Missing source')

    if (options.checkSyntax) {
      const errorsText = getSyntaxErrors(normalize(source))

      if (errorsText) {
        return {
          error: errorsText,
        }
      }
    }

    const magic = new MagicString(source)
    const importString = options.parseFtl === true ? '' : '\nimport { FluentResource } from \'@fluent/bundle\'\n'

    if (source.length === 0) {
      magic.append('{"body":[]}')
    }
    else if (options.parseFtl === true) {
      const resource = new FluentResource(normalize(source))
      magic.overwrite(0, source.length, JSON.stringify(resource))
    }
    else {
      magic.overwrite(0, source.length, `${pureAnotation}new FluentResource(${JSON.stringify(normalize(source))})`)
    }

    if (template.length === 2) {
      magic.prepend(importString + template[0])
      magic.append(template[1])
    }
    else if (template.length === 3) {
      magic.prepend(importString + template[0] + locale + template[1])
      magic.append(template[2])
    }

    return {
      code: {
        code: magic.toString(),
        map: magic.generateMap(),
      },
    }
  }
}
