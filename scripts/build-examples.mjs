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
  await execa('pnpm', ['i'], { stdio: 'inherit' })
  await execa('pnpm', ['build'], { stdio: 'inherit' })

  for (const example of examples) {
    console.log(chalk.bold(chalk.yellow(`building ${example.folder}...`)))
    await execa('pnpm', ['add', `../`], { stdio: 'inherit', cwd: example.folder })
    await execa('pnpm', ['i'], { stdio: 'inherit', cwd: example.folder })
    await execa('pnpm', ['build'], { stdio: 'inherit', cwd: example.folder })
  }

  for (const typescriptExample of examples.filter((ex) => ex.package.scripts.typecheck != null)) {
    console.log(chalk.bold(chalk.yellow(`typechecking ${typescriptExample.folder}...`)))
    await execa('pnpm', ['typecheck'], { stdio: 'inherit', cwd: typescriptExample.folder })
  }
}

await buildExamples()
