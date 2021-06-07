import { readdirSync, readFileSync, statSync } from 'fs'
import execa from 'execa'
import chalk from 'chalk'

const examples = readdirSync('examples')
  .filter((f) => statSync(`examples/${f}`).isDirectory())
  .map((f) => ({
    folder: `examples/${f}`,
    package: JSON.parse(readFileSync(`examples/${f}/package.json`)),
  }))

async function buildExamples () {
  await execa('yarn', [], { stdio: 'inherit' })
  await execa('yarn', ['build'], { stdio: 'inherit' })
  await execa('yarn', ['pack', '-f', '../../fluent-vue.tgz'], {
    stdio: 'inherit',
    cwd: 'packages/fluent-vue'
  })

  for (const example of examples) {
    console.log(chalk.bold(chalk.yellow(`building ${example.folder}...`)))
    await execa('yarn', ['add', '../../fluent-vue.tgz'], { stdio: 'inherit', cwd: example.folder })
    await execa('yarn', [], { stdio: 'inherit', cwd: example.folder })
    await execa('yarn', ['build'], { stdio: 'inherit', cwd: example.folder })
  }

  for (const typescriptExample of examples.filter((ex) => ex.package.scripts.typecheck != null)) {
    console.log(chalk.bold(chalk.yellow(`typechecking ${typescriptExample.folder}...`)))
    await execa('yarn', ['typecheck'], { stdio: 'inherit', cwd: typescriptExample.folder })
  }
}

await buildExamples()
