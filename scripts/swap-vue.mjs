import { readFileSync, writeFileSync } from 'fs'
import { execa } from 'execa'

const vue3packages = {
  'vue': 'npm:vue@^3.2.36',
  '@vue/compiler-sfc': '^3.2.36',
  '@vue/test-utils': '^2.0.0'
}

const vue2packages = {
  'vue': 'npm:vue@^2.6.14',
  'vue-template-compiler': '^2.6.14',
  '@vue/test-utils': '^1.2.1',
  '@vue/composition-api': '^1.0.2'
}

const packageFile = './package.json'
const packageFileData = readFileSync(packageFile).toString()
const packageData = JSON.parse(packageFileData)

async function switchPackages (fromPackages, toPackages) {
  Object.keys(fromPackages).forEach((key) => delete packageData.devDependencies[key])
  Object.assign(packageData.devDependencies, toPackages)

  const packageString = JSON.stringify(packageData, null, 2)
  writeFileSync(packageFile, packageString + '\n')

  await execa('pnpm', ['i', '--no-frozen-lockfile'], { stdio: 'inherit' })
  await execa('pnpm', ['vue-demi-fix'], { stdio: 'inherit' })

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
