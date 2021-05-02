const { cd, exec, echo } = require('shelljs')
const { readFileSync } = require('fs')
const url = require('url')

let repoUrl
let pkg = JSON.parse(readFileSync('package.json'))
if (typeof pkg.repository === 'object') {
  if (!pkg.repository.hasOwnProperty('url')) {
    throw new Error('URL does not exist in repository section')
  }
  repoUrl = pkg.repository.url
} else {
  repoUrl = pkg.repository
}

let parsedUrl = url.parse(repoUrl)
let repository = (parsedUrl.host || '') + (parsedUrl.path || '')
let ghToken = process.env.GH_TOKEN

echo('Deploying docs!!!')
cd('docs')
exec('yarn build')
cd('.vuepress/dist')
echo('fluent-vue.demivan.me').to('CNAME')
exec('git init')
exec('git add .')
exec('git config user.name "Ivan Demchuk"')
exec('git config user.email "ivan.demchuk@gmail.com"')
exec('git commit -m "docs(docs): update gh-pages"')
exec(`git push --force --quiet "https://${ghToken}@${repository}" master:gh-pages`)
echo('Docs deployed!!')
