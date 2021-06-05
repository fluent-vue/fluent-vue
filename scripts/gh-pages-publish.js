const { cd, exec, echo } = require('shelljs')
const { readFileSync } = require('fs')

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
const repository = (parsedUrl.host || '') + (parsedUrl.path || '')
const ghToken = process.env.GH_TOKEN

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
