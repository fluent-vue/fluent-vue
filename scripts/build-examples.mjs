import { readdirSync, readFileSync, existsSync, mkdirSync } from 'fs'
import path from 'path'
import execa from 'execa'
import chalk from 'chalk'

const id = Math.random().toString(36).substr(2, 9)

const examples = readdirSync('examples')
  .filter((f) => existsSync(`examples/${f}/package.json`))
  .map((f) => ({
    folder: `examples/${f}`,
    package: JSON.parse(readFileSync(`examples/${f}/package.json`)),
  }))

async function buildExamples () {
  await execa('yarn', [], { stdio: 'inherit' })
  await execa('yarn', ['build'], { stdio: 'inherit' })
  const tempPath = path.resolve('temp')
  if (!existsSync(tempPath))
    mkdirSync(tempPath)
  await execa('yarn', ['pack', '-f', `../../temp/fluent-vue-${id}.tgz`], {
    stdio: 'inherit',
    cwd: 'packages/fluent-vue'
  })

  for (const example of examples) {
    console.log(chalk.bold(chalk.yellow(`building ${example.folder}...`)))
    await execa('yarn', ['add', `../../temp/fluent-vue-${id}.tgz`], { stdio: 'inherit', cwd: example.folder })
    await execa('yarn', [], { stdio: 'inherit', cwd: example.folder })
    await execa('yarn', ['build'], { stdio: 'inherit', cwd: example.folder })
  }

  for (const typescriptExample of examples.filter((ex) => ex.package.scripts.typecheck != null)) {
    console.log(chalk.bold(chalk.yellow(`typechecking ${typescriptExample.folder}...`)))
    await execa('yarn', ['typecheck'], { stdio: 'inherit', cwd: typescriptExample.folder })
  }
}

await buildExamples()
