import path from 'path'
import ts from '@rollup/plugin-typescript'
import replace from '@rollup/plugin-replace'
import dts from 'rollup-plugin-dts'
import nodeResolvePlugin from '@rollup/plugin-node-resolve'
import commonjsPlugin from '@rollup/plugin-commonjs'

if (!process.env.TARGET) {
  throw new Error('TARGET package must be specified via --environment flag.')
}

const emitTypes = process.env.TYPES != null

const packagesDir = path.resolve(__dirname, 'packages')
const packageDir = path.resolve(packagesDir, process.env.TARGET)
const name = path.basename(packageDir)
const resolve = (p) => path.resolve(packageDir, p)
const pkg = require(resolve('package.json'))
const packageOptions = pkg.buildOptions || {}

// ensure TS checks only once for each build
let hasTSChecked = false

const outputConfigs = {
  esm: {
    file: resolve(`dist/${name}.esm.js`),
    format: 'es'
  },
  cjs: {
    file: resolve(`dist/${name}.cjs.js`),
    format: 'cjs',
    exports: 'auto'
  },
  global: {
    file: resolve(`dist/${name}.global.js`),
    format: 'iife'
  }
}

const defaultFormats = ['esm', 'cjs']
const inlineFormats = process.env.FORMATS && process.env.FORMATS.split(',')
const packageFormats = inlineFormats || packageOptions.formats || defaultFormats
const packageConfigs = process.env.PROD_ONLY
  ? []
  : packageFormats.map((format) => createConfig(format, outputConfigs[format]))

if (process.env.NODE_ENV === 'production') {
  packageFormats.forEach((format) => {
    if (packageOptions.prod === false) {
      return
    }
    if (format === 'cjs') {
      packageConfigs.push(createProductionConfig(format))
    }
    if (/^(global|esm)/.test(format)) {
      packageConfigs.push(createMinifiedConfig(format))
    }
  })
}

if (emitTypes) {
  packageConfigs.push({
    input: resolve(`dist/dist/packages/${name}/src/index.d.ts`),
    output: [{ file: resolve(`dist/${name}.d.ts`), format: "es" }],
    plugins: [dts()],
  })
}

export default packageConfigs

function createConfig (format, output, plugins = []) {
  if (!output) {
    console.log(require('chalk').yellow(`invalid format: "${format}"`))
    process.exit(1)
  }

  output.sourcemap = !!process.env.SOURCE_MAP
  output.externalLiveBindings = false

  const isProductionBuild = process.env.__DEV__ === 'false' || /\.prod\.js$/.test(output.file)
  const isGlobalBuild = /global/.test(format)

  if (isGlobalBuild) {
    output.name = packageOptions.name
    output.globals = packageOptions.globals || {}
  }

  const shouldEmitDeclarations = emitTypes && !hasTSChecked

  const tsPlugin = ts({
    tsconfig: path.resolve(__dirname, 'tsconfig.json'),
    sourceMap: output.sourcemap,
    declaration: shouldEmitDeclarations,
    exclude: ['**/__tests__']
  })

  // we only need to check TS and generate declarations once for each build.
  // it also seems to run into weird issues when checking multiple times
  // during a single build.
  hasTSChecked = true

  const entryFile = 'src/index.ts'

  const external = isGlobalBuild
    // Global build. Externalize peer and global dependencies
    ? [...Object.keys(pkg.peerDependencies || {}), ...Object.keys(packageOptions.globals || {})]
    // Node / esm builds. Externalize everything.
    : [...Object.keys(pkg.dependencies || {}), ...Object.keys(pkg.peerDependencies || {})]

  return {
    input: resolve(entryFile),
    // Global and Browser ESM builds inlines everything so that they can be
    // used alone.
    external,
    plugins: [
      nodeResolvePlugin(),
      commonjsPlugin(),
      tsPlugin,
      createReplacePlugin(isProductionBuild),
      ...plugins
    ],
    output,
    onwarn: (msg, warn) => {
      if (!/Circular/.test(msg)) {
        warn(msg)
      }
    },
    treeshake: {
      moduleSideEffects: false
    }
  }
}

function createReplacePlugin (isProduction) {
  return replace({
    preventAssignment: true,
    values: {
      'process.env.NODE_ENV': JSON.stringify(isProduction ? 'production' : 'development')
    }
  })
}

function createProductionConfig (format) {
  return createConfig(format, {
    file: resolve(`dist/${name}.${format}.prod.js`),
    format: outputConfigs[format].format,
    exports: 'auto'
  })
}

function createMinifiedConfig (format) {
  const { terser } = require('rollup-plugin-terser')
  return createConfig(
    format,
    {
      file: outputConfigs[format].file.replace(/\.js$/, '.prod.js'),
      format: outputConfigs[format].format
    },
    [
      terser({
        module: /^esm/.test(format),
        compress: {
          ecma: 2015,
          pure_getters: true
        }
      })
    ]
  )
}
