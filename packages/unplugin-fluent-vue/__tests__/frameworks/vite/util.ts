import type { InlineConfig, ModuleNode } from 'vite'

import { resolve, sep } from 'node:path'
import { createServer } from 'vite'

const baseDir = resolve(__dirname, '../..')

export async function compile(options: InlineConfig, file: string): Promise<string | undefined> {
  const vite = await createServer({
    root: baseDir,
    ...options,
    plugins: [
      ...options.plugins,
      {
        name: 'externals',
        config(config) {
          const newAlias = [
            ...(config?.resolve?.alias ?? []),
            { find: /^vue$/, replacement: 'virtual:empty:vue' },
            { find: /^@fluent\/bundle$/, replacement: 'virtual:empty:fluent-bundle' },
          ]

          config.resolve = {
            ...(config.resolve ?? {}),
            alias: newAlias,
          }
        },
      },
      {
        name: 'virtual:empty',
        resolveId(id) {
          if (id.startsWith('virtual:empty:'))
            return id
        },
        load(id) {
          if (id.startsWith('virtual:empty:'))
            return 'export default {}'
        },
      },
    ],
  })

  await vite.transformRequest(file)

  const module = await vite.moduleGraph.getModuleByUrl(file)

  const getAllModules = (module: ModuleNode): ModuleNode[] => [module].concat([...module.importedModules.values()].flatMap(getAllModules))

  const modules = await Promise.all(getAllModules(module)
    .map(async module => ({
      transform: await vite.transformRequest(module.url),
      module,
    })))

  const code = modules
    .filter(module => module.transform)
    .filter(module => !module.module.url.includes('node_modules'))
    .filter(module => !module.module.url.includes('virtual:empty:'))
    .map(module => `=== ${module.module.url} ===\n${module.transform.code}`)
    .join('\n\n')

  // normalize paths
  return code
    ?.replaceAll(baseDir.replaceAll(sep, '/'), '')
    .replace(/\/@(fs|id).*?node_modules\//g, '')
    .replaceAll('\\r\\n', '\\n')
}
