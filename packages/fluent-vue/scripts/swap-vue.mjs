import { readFileSync, writeFileSync } from 'node:fs'
import process from 'node:process'
import { execa } from 'execa'

const vue3packages = {
  'vue': 'catalog:vue3',
  'vue-2': 'catalog:vue3',
  'vue-3': 'catalog:vue3',
  '@vue/compiler-sfc': 'catalog:vue3',
  '@vue/test-utils': 'catalog:vue3',
}

const vue2packages = {
  'vue': 'catalog:vue2',
  'vue-template-compiler': 'catalog:vue2',
  '@vue/test-utils': 'catalog:vue2',
  '@vue/composition-api': 'catalog:vue2',
}

const packageFile = './package.json'
const packageFileData = readFileSync(packageFile).toString()
const packageData = JSON.parse(packageFileData)

async function switchPackages(fromPackages, toPackages) {
  Object.keys(fromPackages).forEach(key => delete packageData.devDependencies[key])
  Object.assign(packageData.devDependencies, toPackages)

  const packageString = JSON.stringify(packageData, null, 2)
  writeFileSync(packageFile, `${packageString}\n`)

  await execa('pnpm', ['i', '--no-frozen-lockfile'], { stdio: 'inherit' })
  await execa('pnpm', ['vue-demi-fix'], { stdio: 'inherit' })

  console.log(`Switched from vue ${fromPackages.vue} to ${toPackages.vue}`)
}

async function useVueVersion(version) {
  if (version === 3 && packageData.devDependencies.vue !== vue3packages.vue)
    await switchPackages(vue2packages, vue3packages)
  else if (version === 2 && packageData.devDependencies.vue !== vue2packages.vue)
    await switchPackages(vue3packages, vue2packages)
  else
    console.log(`Vue ${version} is already in use`)
}

const version = Number(process.argv[2]) || 3

useVueVersion(version)
