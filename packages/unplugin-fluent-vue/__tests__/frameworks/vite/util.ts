import type { InlineConfig } from 'vite'

import { resolve, sep } from 'node:path'
import { createServer } from 'vite'

const baseDir = resolve(__dirname, '../..')

export async function compile(options: InlineConfig, file: string): Promise<string | undefined> {
  const vite = await createServer({
    root: baseDir,
    ...options,
    plugins: [
      ...options.plugins ?? [],
      {
        name: 'externals',
        config: () => ({
          resolve: {
            alias: [
              { find: /^vue$/, replacement: 'virtual:empty:vue' },
              { find: /^@fluent\/bundle$/, replacement: 'virtual:empty:fluent-bundle' },
            ],
          },
        }),
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

  if (module == null)
    throw new Error(`Module not found for ${file}`)

  const modules = await Promise.all([module, ...module.importedModules]
    .map(async module => ({
      transform: await vite.transformRequest(module.url),
      module,
    })))

  await vite.close()

  const code = modules
    .filter(module => module.transform)
    .filter(module => !module.module.url.includes('node_modules'))
    .filter(module => !module.module.url.includes('virtual:empty:'))
    .map(module => `=== ${module.module.url} ===\n${module.transform!.code}`)
    .join('\n\n')

  // normalize paths
  return code
    ?.replaceAll(baseDir.replaceAll(sep, '/'), '')
    .replace(/\/@(fs|id).*?node_modules\//g, '')
    .replaceAll('\\r\\n', '\\n')
}
