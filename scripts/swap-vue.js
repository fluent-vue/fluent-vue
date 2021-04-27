const fs = require('fs')
const path = require('path')
const execa = require('execa')

const vue3packages = {
  vue: '^3.0.11',
  '@vue/compiler-sfc': '^3.0.11',
  '@vue/test-utils': '^2.0.0-beta.2',
}

const vue2packages = {
  vue: '^2.6.12',
  'vue-template-compiler': '^2.6.12',
  '@vue/test-utils': '^1.1.4',
  '@vue/composition-api': '^1.0.0-rc.7',
}

const packageFile = path.join(__dirname, '../packages/fluent-vue/package.json')
const package = require(packageFile)

async function switchPackages(fromPackages, toPackages) {
  Object.keys(fromPackages).forEach((key) => delete package.devDependencies[key])
  package.devDependencies = {
    ...package.devDependencies,
    ...toPackages,
  }

  const packageString = JSON.stringify(package, null, 2)
  fs.writeFileSync(packageFile, packageString)

  await execa('yarn', [], { stdio: 'inherit' })
  await execa('yarn', ['vue-demi-fix'], { stdio: 'inherit' })

  console.log(`Swiched from vue ${fromPackages.vue} to ${toPackages.vue}`)
}

async function useVueVersion(version) {
  if (version === 3 && package.devDependencies['vue'] !== vue3packages.vue) {
    await switchPackages(vue2packages, vue3packages)
  } else if (version === 2 && package.devDependencies['vue'] !== vue2packages.vue) {
    await switchPackages(vue3packages, vue2packages)
  } else {
    console.log(`Vue ${version} is already in use`)
  }
}

const version = Number(process.argv[2]) || 3

useVueVersion(version)
