import type { ExternalPluginOptions } from '../types'
import { stat as fsStat } from 'node:fs/promises'
import { dirname, join, relative } from 'node:path'

import { createFilter, makeLegalIdentifier } from '@rollup/pluginutils'
import MagicString from 'magic-string'

import { createUnplugin } from 'unplugin'
import { isCustomBlock, parseVueRequest } from '../loader-query'
import { getInjectFtl } from './ftl/inject'

const isVue = createFilter(['**/*.vue'])
const isFtl = createFilter(['**/*.ftl'])

interface Dependency {
  locale: string
  ftlPath: string
  relativeFtlPath: string
  importVariable: string
}

async function fileExists(filename: string): Promise<boolean> {
  try {
    const stat = await fsStat(filename, { throwIfNoEntry: false } as any)
    return !!stat
  }
  catch {
    return false
  }
}

function normalizePath(path: string) {
  return path.replace(/\\/g, '/')
}

function isFluentCustomBlock(id: string) {
  const request = parseVueRequest(id)
  return isCustomBlock(request.query, { blockType: 'fluent' })
}

export const unplugin = createUnplugin((options: ExternalPluginOptions) => {
  const resolvedOptions = {
    checkSyntax: true,
    parseFtl: false,
    virtualModuleName: 'virtual:ftl-for-file',
    getFtlPath: undefined as ((locale: string, vuePath: string) => string) | undefined,
    ...options,
  }

  let getFtlPath
  if ('getFtlPath' in options) {
    getFtlPath = options.getFtlPath
  }
  else {
    getFtlPath = (locale: string, vuePath: string) => {
      return join(options.ftlDir, locale, `${relative(options.baseDir, vuePath)}.ftl`)
    }
  }

  const getTranslationsForFile = async (id: string) => {
    const dependencies: Dependency[] = []
    for (const locale of options.locales) {
      const ftlPath = normalizePath(getFtlPath(locale, id))
      const ftlExists = await fileExists(ftlPath)
      let relativeFtlPath = normalizePath(relative(dirname(id), ftlPath))
      if (!relativeFtlPath.startsWith('.'))
        relativeFtlPath = `./${relativeFtlPath}`

      if (ftlExists) {
        dependencies.push({
          locale,
          ftlPath,
          relativeFtlPath,
          importVariable: `${makeLegalIdentifier(locale)}_ftl`,
        })
      }
    }

    return dependencies
  }

  return {
    name: 'unplugin-fluent-vue-external',
    enforce: 'pre',
    resolveId(id, importer) {
      if (id === resolvedOptions.virtualModuleName)
        return `${id}?importer=${importer}`
    },
    loadInclude(id: string) {
      return id.startsWith(resolvedOptions.virtualModuleName)
    },
    async load(id) {
      if (!id.startsWith(resolvedOptions.virtualModuleName))
        return

      const importer = id.split('?importer=')[1]

      const translations = await getTranslationsForFile(importer)

      for (const { ftlPath } of translations)
        this.addWatchFile(ftlPath)

      let code = ''
      for (const { ftlPath, importVariable } of translations)
        code += `import ${importVariable} from '${ftlPath}';\n`

      code += `export default { ${translations
        .map(({ locale, importVariable }) => `'${locale}': ${importVariable}`)
        .join(', ')} }\n`

      return code
    },
    transformInclude(id: string) {
      return isVue(id) || isFtl(id) || isFluentCustomBlock(id)
    },
    async transform(source: string, id: string) {
      if (isVue(id)) {
        const magic = new MagicString(source, { filename: id })

        const translations = await getTranslationsForFile(id)

        if (translations.length === 0)
          return

        for (const { relativeFtlPath, locale } of translations)
          magic.append(`<fluent locale="${locale}" src="${relativeFtlPath}"></fluent>\n`)

        return {
          code: magic.toString(),
          map: magic.generateMap(),
        }
      }

      if (isFtl(id)) {
        const injectFtl = getInjectFtl(resolvedOptions, true)
        const result = injectFtl`
export default ${source}
`

        if (result.error)
          this.error(result.error)

        return result.code
      }

      const query = parseVueRequest(id).query
      if (isFluentCustomBlock(id)) {
        const injectFtl = getInjectFtl(resolvedOptions)
        const result = injectFtl`
export default function (Component) {
  const target = Component.options || Component
  target.fluent = target.fluent || {}
  target.fluent['${query.locale}'] = ${source}
}
`

        if (result.error)
          this.error(result.error)

        return result.code
      }

      return undefined
    },
  }
})

export const vitePlugin = unplugin.vite
export const rollupPlugin = unplugin.rollup
export const webpackPlugin = unplugin.webpack
