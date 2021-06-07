const fs = require('fs')
const path = require('path')
const execa = require('execa')

const vue3packages = {
  vue: 'npm:vue@^3.0.11',
  '@vue/compiler-sfc': '^3.0.11',
  '@vue/test-utils': '^2.0.0-rc.6'
}

const vue2packages = {
  vue: 'npm:vue@^2.6.13',
  'vue-template-compiler': '^2.6.13',
  '@vue/test-utils': '^1.1.4',
  '@vue/composition-api': '^1.0.0-rc.7'
}

const packageFile = path.join(__dirname, '../packages/fluent-vue/package.json')
const packageData = require(packageFile)

async function switchPackages (fromPackages, toPackages) {
  Object.keys(fromPackages).forEach((key) => delete packageData.devDependencies[key])
  packageData.devDependencies = {
    ...packageData.devDependencies,
    ...toPackages
  }

  const packageString = JSON.stringify(packageData, null, 2)
  fs.writeFileSync(packageFile, packageString)

  await execa('yarn', [], { stdio: 'inherit' })
  await execa('yarn', ['vue-demi-fix'], { stdio: 'inherit' })

  console.log(`Swiched from vue ${fromPackages.vue} to ${toPackages.vue}`)
}

async function useVueVersion (version) {
  if (version === 3 && packageData.devDependencies.vue !== vue3packages.vue) {
    await switchPackages(vue2packages, vue3packages)
  } else if (version === 2 && packageData.devDependencies.vue !== vue2packages.vue) {
    await switchPackages(vue3packages, vue2packages)
  } else {
    console.log(`Vue ${version} is already in use`)
  }
}

const version = Number(process.argv[2]) || 3

useVueVersion(version)
