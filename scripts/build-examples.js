const execa = require('execa')
const fs = require('fs')

const examples = fs
  .readdirSync('examples')
  .filter((f) => fs.statSync(`examples/${f}`).isDirectory())
  .map((f) => ({
    folder: `examples/${f}`,
    package: require(`../examples/${f}/package.json`),
  }))

async function buildExamples() {
  await execa('yarn', [], { stdio: 'inherit' })
  await execa('yarn', ['build'], { stdio: 'inherit' })
  await execa('yarn', ['pack', '-f', '../../fluent-vue.tgz'], {
    stdio: 'inherit',
    cwd: 'packages/fluent-vue',
  })

  for (const example of examples) {
    await execa('yarn', ['add', '../../fluent-vue.tgz'], { stdio: 'inherit', cwd: example.folder })
    await execa('yarn', [], { stdio: 'inherit', cwd: example.folder })
    await execa('yarn', ['build'], { stdio: 'inherit', cwd: example.folder })
  }

  for (const typescriptExample of examples.filter((ex) => ex.package.scripts.typecheck != null)) {
    await execa('yarn', ['typecheck'], { stdio: 'inherit', cwd: typescriptExample.folder })
  }
}

buildExamples()
