import { existsSync, readFileSync, readdirSync } from 'node:fs'
import { spawn } from 'node:child_process'

function exec(command, params, ops) {
  const p = spawn(command, params, ops)

  return new Promise((resolve) => {
    p.on('exit', (code) => {
      resolve(code)
    })
  })
}

const examples = readdirSync('examples')
  .filter(f => existsSync(`examples/${f}/package.json`))
  .map(f => ({
    folder: `examples/${f}`,
    package: JSON.parse(readFileSync(`examples/${f}/package.json`)),
  }))

async function buildExamples() {
  await exec('pnpm', ['i'], { stdio: 'inherit' })
  await exec('pnpm', ['build'], { stdio: 'inherit' })
  await exec('pnpm', ['rimraf', 'node_modules'], { stdio: 'inherit' })

  for (const example of examples) {
    console.log(`building ${example.folder}...`)
    await exec('pnpm', ['add', 'file:../../'], { stdio: 'inherit', cwd: example.folder })
    await exec('pnpm', ['i'], { stdio: 'inherit', cwd: example.folder })
    await exec('pnpm', ['build'], { stdio: 'inherit', cwd: example.folder })
  }

  for (const typescriptExample of examples.filter(ex => ex.package.scripts.typecheck != null)) {
    console.log(`typechecking ${typescriptExample.folder}...`)
    await exec('pnpm', ['typecheck'], { stdio: 'inherit', cwd: typescriptExample.folder })
  }
}

await buildExamples()
