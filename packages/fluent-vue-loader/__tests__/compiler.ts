import path from 'path'
import webpack from 'webpack'
import { createFsFromVolume, Volume } from 'memfs'

import { VueLoaderPlugin } from 'vue-loader'

export default async (fixture: string, options = {}, hot = false): Promise<webpack.Stats> => {
  const compiler = webpack({
    context: __dirname,
    entry: `./${fixture}`,
    output: {
      path: path.resolve(__dirname),
      filename: 'bundle.js'
    },
    mode: 'production',
    module: {
      rules: [
        {
          resourceQuery: /blockType=fluent/,
          use: {
            loader: path.resolve(__dirname, '../src/index.ts'),
            options
          }
        },
        {
          test: /\.vue$/,
          loader: 'vue-loader'
        }
      ]
    },
    plugins: [
      new VueLoaderPlugin(),
      ...(hot ? [new webpack.HotModuleReplacementPlugin()] : [])
    ]
  })

  compiler.outputFileSystem = createFsFromVolume(new Volume())
  compiler.outputFileSystem.join = path.join.bind(path)

  return await new Promise((resolve, reject) => {
    compiler.run((err, stats) => {
      if (err != null || stats == null) return reject(err)
      if (stats.hasErrors()) return reject(stats.toJson().errors)

      resolve(stats)
    })
  })
}
