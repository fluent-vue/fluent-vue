/*
Produces production builds and stitches together d.ts files.

To specify the package to build, simply pass its name and the desired build
formats to output (defaults to `buildOptions.formats` specified in that package,
or "esm,cjs"):

```
# name supports fuzzy match. will build all packages with name containing "dom":
yarn build dom

# specify the format to output
yarn build core --formats cjs
```
*/

import fs from 'fs-extra'
import path from 'path'
import chalk from 'chalk'
import { gzipSync } from 'zlib'
import { compress } from 'brotli'
import execa from 'execa'
import { targets as allTargets, fuzzyMatchTarget } from './utils.mjs'

import { Extractor, ExtractorConfig } from '@microsoft/api-extractor'

import { build as esbuild } from 'esbuild'

import minimist from 'minimist'

const args = minimist(process.argv.slice(2))
const targets = args._
const formats = args.formats || args.f
const devOnly = args.devOnly || args.d
const watch = args.watch || args.w
const buildTypes = args.types || args.t
const prodOnly = !devOnly && (args.prodOnly || args.p)
const sourceMap = args.sourcemap || args.s
const buildAllMatching = args.all || args.a
const shouldCheckSize = args.size || args.s || false

run()

async function run () {
  const selectedTargets = !targets.length ? allTargets : fuzzyMatchTarget(targets, buildAllMatching)

  await buildAll(selectedTargets)

  if (shouldCheckSize) {
    checkAllSizes(selectedTargets)
  }
}

async function buildAll (targets) {
  for (const target of targets) {
    await build(target)
  }
}

async function build (target) {
  const pkgDir = path.resolve(`packages/${target}`)
  const pkgString = await fs.readFile(`${pkgDir}/package.json`)
  const pkg = JSON.parse(pkgString)

  // if building a specific format, do not remove dist.
  if (!formats) {
    await fs.remove(`${pkgDir}/dist`)
  }

  const env = (pkg.buildOptions && pkg.buildOptions.env) || (devOnly ? 'development' : 'production')

  const production = env === 'production'

  const name = path.basename(pkgDir)
  const resolve = (p) => path.resolve(pkgDir, p)
  const packageOptions = pkg.buildOptions || {}

  // For global build we externalize peer and global dependencies
  const globalExternals = [...Object.keys(pkg.peerDependencies || {}), ...Object.keys(packageOptions.globals || {})]

  // for Node and esm builds we externalize everything.
  const externals = [...Object.keys(pkg.dependencies || {}), ...Object.keys(pkg.peerDependencies || {})]

  const baseConfigs = {
    esm: {
      outfile: `dist/${name}.esm.js`,
      format: 'esm',
      external: externals
    },
    cjs: {
      outfile: `dist/${name}.cjs.js`,
      format: 'cjs',
      external: externals
    },
    global: {
      outfile: `dist/${name}.global.js`,
      format: 'iife',
      globalName: packageOptions.name,
      external: globalExternals,
      plugins: [
        {
          name: 'global',
          setup (build) {
            const moduleNames = Object.keys(packageOptions.globals)
            const filter = new RegExp(`^(${moduleNames.join("|")})$`)

            build.onResolve({ filter }, (args) => ({
              path: args.path,
              namespace: 'global',
            }));

            build.onLoad({ filter: /.*/, namespace: 'global' }, (args) => {
              const contents = `module.exports = ${packageOptions.globals[args.path]}`;
              return { contents };
            });
          }
        }
      ]
    }
  }

  const packageFormats = formats && formats.split(',') || packageOptions.formats || ['esm', 'cjs']

  let configs = []

  if (!prodOnly) {
    configs = configs.concat(packageFormats.map(format => baseConfigs[format]))
  }

  if (production) {
    const prodConfigs = packageFormats
      .map(format => ({
        ...baseConfigs[format],
        outfile: `dist/${name}.${format}.prod.js`,
        minify: true
      }))

    configs = configs.concat(prodConfigs)
  }

  for (const config of configs) {
    await esbuild({
      ...config,
      absWorkingDir: resolve('.'),
      entryPoints: ['src/index.ts'],
      bundle: true,
      sourcemap: sourceMap,
      watch: watch,
      define: {
        'process.env.NODE_ENV': JSON.stringify(env)
      },
      logLevel: 'debug'
    })
  }

  if (buildTypes && pkg.types) {
    console.log()
    console.log(chalk.bold(chalk.yellow(`Building type definitions for ${target}...`)))

    await execa('yarn', ['tsc', '-p', 'tsconfig.json', '--declaration', '--emitDeclarationOnly'], {
      cwd: pkgDir,
      stdio: 'inherit'
    })

    console.log()
    console.log(chalk.bold(chalk.yellow(`Rolling up type definitions for ${target}...`)))

    // build types
    const extractorConfigPath = path.resolve(pkgDir, 'api-extractor.json')
    const extractorConfig = ExtractorConfig.loadFileAndPrepare(extractorConfigPath)
    const result = Extractor.invoke(extractorConfig, {
      localBuild: true,
      showVerboseMessages: true
    })

    if (result.succeeded) {
      console.log(chalk.bold(chalk.green('API Extractor completed successfully.')))
    } else {
      console.error(
        `API Extractor completed with ${result.errorCount} errors and ${result.warningCount} warnings`
      )
      process.exitCode = 1
    }

    await fs.remove(`${pkgDir}/dist/tsc`)
  }
}

function checkAllSizes (targets) {
  if (devOnly) {
    return
  }
  console.log()
  for (const target of targets) {
    if (target !== 'fluent-vue') {
      return
    }

    checkSize(target)
  }
  console.log()
}

function checkSize (target) {
  const pkgDir = path.resolve(`packages/${target}`)
  checkFileSize(`${pkgDir}/dist/${target}.global.prod.js`)
}

function checkFileSize (filePath) {
  if (!fs.existsSync(filePath)) {
    return
  }
  const file = fs.readFileSync(filePath)
  const minSize = (file.length / 1024).toFixed(2) + 'kb'
  const gzipped = gzipSync(file)
  const gzippedSize = (gzipped.length / 1024).toFixed(2) + 'kb'
  const compressed = compress(file)
  const compressedSize = (compressed.length / 1024).toFixed(2) + 'kb'
  console.log(
    `${chalk.gray(
      chalk.bold(path.basename(filePath))
    )} min:${minSize} / gzip:${gzippedSize} / brotli:${compressedSize}`
  )
}
