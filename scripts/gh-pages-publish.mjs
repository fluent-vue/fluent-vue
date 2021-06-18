import execa from 'execa'
import chalk from 'chalk'
import { exit } from 'process'
import { readFileSync, writeFileSync } from 'fs'

let repoUrl
const pkg = JSON.parse(readFileSync('package.json'))
if (typeof pkg.repository === 'object') {
  if (!Object.prototype.hasOwnProperty.call(pkg.repository, 'url')) {
    throw new Error('URL does not exist in repository section')
  }
  repoUrl = pkg.repository.url
} else {
  repoUrl = pkg.repository
}

const parsedUrl = new URL(repoUrl)
const repository = (parsedUrl.host || '') + (parsedUrl.pathname || '')

const ghToken = process.env.GH_TOKEN

if (!ghToken) {
  console.error("No GH_TOKEN specified")
  exit(1)
}

function echo(text) {
  console.log(chalk.bold(chalk.yellow(text)))
}

echo('Deploying docs!!!')
await execa('yarn', [], { cwd: 'docs', stdio: 'inherit' })
await execa('yarn', ['build'], { cwd: 'docs', stdio: 'inherit' })

const options = { cwd: 'docs/.vuepress/dist', stdio: 'inherit' }
writeFileSync('docs/.vuepress/dist/CNAME', 'fluent-vue.demivan.me')
await execa('git', ['init'], options)
await execa('git', ['add', '.'], options)
await execa('git', ['config', 'user.name', '"Ivan Demchuk"'], options)
await execa('git', ['config', 'user.email', '"ivan.demchuk@gmail.com"'], options)
await execa('git', ['commit', '-m', '"docs(docs): update gh-pages"'], options)
await execa('git', ['push', '--force', '--quiet', `https://${ghToken}@${repository}`, 'master:gh-pages'], options)

echo('Docs deployed!!')
