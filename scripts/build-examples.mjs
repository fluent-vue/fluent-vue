import { readdirSync, readFileSync, existsSync } from 'fs'
import { execa } from 'execa'

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
    console.log(`building ${example.folder}...`)
    await execa('pnpm', ['add', `file:../../`], { stdio: 'inherit', cwd: example.folder })
    await execa('pnpm', ['i'], { stdio: 'inherit', cwd: example.folder })
    await execa('pnpm', ['build'], { stdio: 'inherit', cwd: example.folder })
  }

  for (const typescriptExample of examples.filter((ex) => ex.package.scripts.typecheck != null)) {
    console.log(`typechecking ${typescriptExample.folder}...`)
    await execa('pnpm', ['typecheck'], { stdio: 'inherit', cwd: typescriptExample.folder })
  }
}

await buildExamples()
