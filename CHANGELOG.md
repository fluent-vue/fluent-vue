## v3.0.0 (2021-06-12)

#### :tada: Stable release :tada:

Complete rewrite of the library since version 2

* Support Vue 3 and 2
* Composition api support
* Webpack loader for defining translation resources in SFC custom blocks
* Rollup/Vite plugin for defining translation resources in SFC custom blocks
* Added Typescript type definitions
* [#472](https://github.com/Demivan/fluent-vue/pull/472) Pass message attributes as i18n component slots props ([@davidrios](https://github.com/davidrios))


## v3.0.0-beta.19 (2021-09-01)

#### :bug: Bug Fixes
* `fluent-vue-cli`
  * [#686](https://github.com/Demivan/fluent-vue/pull/686) Fix compiler-sfc trying to access the document ([@Demivan](https://github.com/Demivan))

#### Committers: 1
- Ivan Demchuk ([@Demivan](https://github.com/Demivan))

## v3.0.0-beta.17 (2021-08-28)

#### :star: New Features
* `fluent-vue-cli`, `fluent-vue`
  * [#679](https://github.com/Demivan/fluent-vue/pull/679) Add api for managing locale messages  ([@Demivan](https://github.com/Demivan))

#### :bug: Bug Fixes
* `fluent-vue`
  * [#673](https://github.com/Demivan/fluent-vue/pull/673) Make bundles property not deeply reactive ([@Demivan](https://github.com/Demivan))

#### :pencil: Documentation
* [#661](https://github.com/Demivan/fluent-vue/pull/661) Updated documentation ([@Demivan](https://github.com/Demivan))

#### Committers: 1
- Ivan Demchuk ([@Demivan](https://github.com/Demivan))


## v3.0.0-beta.16 (2021-07-19)

#### :star: New Features
* `rollup-plugin-fluent-vue`
  * [#649](https://github.com/Demivan/fluent-vue/pull/649) Implement Rollup/Vite plugin ([@Demivan](https://github.com/Demivan))

#### :bug: Bug Fixes
* `fluent-vue-loader`
  * [#648](https://github.com/Demivan/fluent-vue/pull/648) Fix incorect paths in package.json ([@Demivan](https://github.com/Demivan))

#### :pencil: Documentation
* `fluent-vue`
  * [#646](https://github.com/Demivan/fluent-vue/pull/646) Update documentation ([@Demivan](https://github.com/Demivan))

#### Committers: 1
- Ivan Demchuk ([@Demivan](https://github.com/Demivan))


## v3.0.0-beta.15 (2021-07-15)

#### :star: New Features
* `fluent-vue-loader`, `fluent-vue`
  * [#644](https://github.com/Demivan/fluent-vue/pull/644) Add `exports` and `homepage` fields to package.json ([@Demivan](https://github.com/Demivan))

#### Committers: 1
- Ivan Demchuk ([@Demivan](https://github.com/Demivan))


## v3.0.0-beta.14 (2021-06-24)

#### :star: New Features
* [#635](https://github.com/Demivan/fluent-vue/pull/635) Reduce bundle size ([@Demivan](https://github.com/Demivan))

#### :pencil: Documentation
* [#631](https://github.com/Demivan/fluent-vue/pull/631) Update docs ([@Demivan](https://github.com/Demivan))

#### Committers: 1
- Ivan Demchuk ([@Demivan](https://github.com/Demivan))


## v3.0.0-beta.13 (2021-06-12)

#### :star: New Features
* `fluent-vue`
  * [#625](https://github.com/Demivan/fluent-vue/pull/625) Rework locale change ([@Demivan](https://github.com/Demivan))

#### :boom: Breaking Change
Initialization code changed from:
```js
const enBundle = new FluentBundle('en')
const ukBundle = new FluentBundle('uk')

const fluent = createFluentVue({
  locale: 'en',
  bundles: [enBundle, ukBundle]
})
```
to:
```js
const enBundle = new FluentBundle('en')
const ukBundle = new FluentBundle('uk')

const fluent = createFluentVue({
  bundles: [enBundle]
})
```

Instead of using `locale` property to select current locale, `bundles` property is now used as current negotiated fallback chain of languages.

This allows consumers to choose language negotiation logic suitable for their app.

#### Committers: 1
- Ivan Demchuk ([@Demivan](https://github.com/Demivan))


## v3.0.0-beta.12 (2021-06-07)

#### :bug: Bug Fixes
* `fluent-vue`
  * [#621](https://github.com/Demivan/fluent-vue/pull/621) Fix directive not updating on locale change with Vue 3.1.0 ([@Demivan](https://github.com/Demivan))

#### Committers: 1
- Ivan Demchuk ([@Demivan](https://github.com/Demivan))


## v3.0.0-beta.11 (2021-06-06)

#### :bug: Bug Fixes
* `fluent-vue`
  * [#612](https://github.com/Demivan/fluent-vue/pull/612) Fix error when using `useFluent` method from Vue 2 ([@Demivan](https://github.com/Demivan))

#### Committers: 1
- Ivan Demchuk ([@Demivan](https://github.com/Demivan))


## v3.0.0-beta.10 (2021-05-31)

#### :star: New Features
* `fluent-vue`
  * [#608](https://github.com/Demivan/fluent-vue/pull/608) Add Vue 3 Typescript types ([@Demivan](https://github.com/Demivan))
  * [#565](https://github.com/Demivan/fluent-vue/pull/565) Add global build for use in browsers ([@Demivan](https://github.com/Demivan))

#### :bug: Bug Fixes
* `fluent-vue`
  * [#509](https://github.com/Demivan/fluent-vue/pull/509) Fix component when using Vue 3 ([@Demivan](https://github.com/Demivan))
  * [#495](https://github.com/Demivan/fluent-vue/pull/495) Fix Vue 2 Typescript definitions ([@Demivan](https://github.com/Demivan))

#### :pencil: Documentation
* [#602](https://github.com/Demivan/fluent-vue/pull/602) Update examples ([@Demivan](https://github.com/Demivan))
* [#564](https://github.com/Demivan/fluent-vue/pull/564) Improve docs ([@Demivan](https://github.com/Demivan))

#### Committers: 1
- Ivan Demchuk ([@Demivan](https://github.com/Demivan))


## v3.0.0-beta.9 (2021-04-13)

#### :star: New Features
* `fluent-vue`
  * [#472](https://github.com/Demivan/fluent-vue/pull/472) Pass message attributes as i18n component slots props ([@davidrios](https://github.com/davidrios))

#### Committers: 2
- David Rios ([@davidrios](https://github.com/davidrios))
- Ivan Demchuk ([@Demivan](https://github.com/Demivan))

## v3.0.0-beta.8 (2021-04-01)


#### Bug Fixes

* **component:** fix i18n component not rerendering on args change ([#459](https://github.com/Demivan/fluent-vue/issues/459)) ([57a2c12](https://github.com/Demivan/fluent-vue/commit/57a2c12e6e4482b2076ca31949cbd002f83b7c87))



## v3.0.0-beta.7 (2021-03-15)



## v3.0.0-beta.6 (2021-03-15)


#### Bug Fixes

* **loader:** trim leading and trailing newlines added by vue-loader ([63d71fc](https://github.com/Demivan/fluent-vue/commit/63d71fc9ae5dfe49e520fcf10948a5df8e5dd201))


#### Features

* **composition:** Add $t and $ta methods to useFluent() ([2697abe](https://github.com/Demivan/fluent-vue/commit/2697abe55cc96f4fec78dbd42fa77a7eb472b2a7))



## v3.0.0-beta.5 (2021-01-14)


#### Bug Fixes

* **component:** fix runtime warning ([80fae89](https://github.com/Demivan/fluent-vue/commit/80fae8913222d47fc1ea85727af739881be02db2))



## v3.0.0-beta.4 (2020-12-21)


#### Features

* add hmr to fluent-vue-loader ([4c05f49](https://github.com/Demivan/fluent-vue/commit/4c05f4980ec5d3b9b5071dc2ee5de774d6f79bcc))



## v3.0.0-beta.3 (2020-11-26)


#### Bug Fixes

* allow $ta method to work without text  ([#170](https://github.com/Demivan/fluent-vue/issues/170)) ([5597392](https://github.com/Demivan/fluent-vue/commit/5597392784c8ab4b6f60c3570f97050e8ae5b973))
* i18n component not working with message overrides ([#236](https://github.com/Demivan/fluent-vue/issues/236)) ([7b3c170](https://github.com/Demivan/fluent-vue/commit/7b3c170a3a17f43f91e948cae5a5f5061518f564))



## v3.0.0-beta.2 (2020-10-08)



## v3.0.0-beta.1 (2020-10-08)


#### Bug Fixes

* **types:** fix typescript definitions ([#160](https://github.com/Demivan/fluent-vue/issues/160)) ([b1985b7](https://github.com/Demivan/fluent-vue/commit/b1985b7f516719da9a72acfaca0dc2116f6d87f3))


#### Features

* add support for Vue 3 ([#158](https://github.com/Demivan/fluent-vue/issues/158)) ([aa06933](https://github.com/Demivan/fluent-vue/commit/aa06933dbaa3f363e0e0e02bc27c290c04582a9b))



## v3.0.0-beta.0 (2020-08-02)



## v3.0.0-alpha.3 (2020-08-02)


#### Bug Fixes

* do not remove root context ([de1042f](https://github.com/Demivan/fluent-vue/commit/de1042f430a24e771364197913d99436d71c55e0))



## v3.0.0-alpha.2 (2020-08-02)


#### Bug Fixes

* bring back ability to dynamically add bundles ([e1360d3](https://github.com/Demivan/fluent-vue/commit/e1360d3af87faa2f6f3317dce10bda4ab1c8c04a))



## v3.0.0-alpha.1 (2020-08-02)



## v3.0.0-alpha.0 (2020-07-12)


#### Code Refactoring

* add 'locale' option for selecting locale ([56a1aac](https://github.com/Demivan/fluent-vue/commit/56a1aac24326050ef8713b078477f13df63c2c9f))
* change how plugin is initialized ([da7728f](https://github.com/Demivan/fluent-vue/commit/da7728fc8249f8ddd039960c354685542cb06076))


#### Features

* **loader:** add webpack fluent-vue-loader ([69e5423](https://github.com/Demivan/fluent-vue/commit/69e54230125d2e92b897d9f8d99d881e6a20210e))


#### BREAKING CHANGES

* plugin initialization code changed:
```js
import { createFluentVue } from 'fluent-vue'

const fluent = createFluentVue({
  locale: 'en',
  bundles: bundles
})

Vue.use(fluent)
```
* instead of using order of bundles for selecting locale
'locale' property on fluent object should be used



## v2.4.5 (2020-04-13)


#### Bug Fixes

* **package:** update yarn.lock to reduce vulnerabilities ([faae0be](https://github.com/Demivan/fluent-vue/commit/faae0bedf93d7d0650b46f9d4fcdfbc6b3d30abb))



## v2.4.4 (2020-04-13)


#### Bug Fixes

* package.json & yarn.lock to reduce vulnerabilities ([#59](https://github.com/Demivan/fluent-vue/issues/59)) ([8f61162](https://github.com/Demivan/fluent-vue/commit/8f6116219ce0666cbe59df22206944f8830b312c))



## v2.4.3 (2020-03-07)


#### Bug Fixes

* **package:** update @fluent/dedent to version 0.2.0 ([2363355](https://github.com/Demivan/fluent-vue/commit/23633550b03b1a2dd712a2774c5a42f947a42025))
* **package:** update @fluent/sequence to version 0.5.0 ([27e5d23](https://github.com/Demivan/fluent-vue/commit/27e5d23718675a6e8dc579405bc08ed2ab6d10ec))



## v2.4.2 (2020-02-18)


#### Bug Fixes

* reduce bundle size by not bundling npm dependencies ([6faca34](https://github.com/Demivan/fluent-vue/commit/6faca34da3e60fd5e881c8114bd9400e4e807914))
* **types:** improve typescript type definitions ([a07a8e3](https://github.com/Demivan/fluent-vue/commit/a07a8e3e3d6a97d25a5cc1ff8e54c3ddab0c263c))



## v2.4.1 (2020-02-16)


#### Bug Fixes

* **package:** make @fluent/bundle a peer dependency and @fluent/dedent a dev dependency ([14c487c](https://github.com/Demivan/fluent-vue/commit/14c487ca33fec7b9b9a544f74b1db221d08331d8)), closes [#43](https://github.com/Demivan/fluent-vue/issues/43)
* **package:** update @fluent/bundle to version 0.15.0 ([2991da9](https://github.com/Demivan/fluent-vue/commit/2991da94922cfa8ccff216f9de2efd90a2b21cbb))


#### Features

* **component:** add component for component interpolation ([79bac0a](https://github.com/Demivan/fluent-vue/commit/79bac0af6afc51cdb5f33461b07fb456c6618134))
* **directive:** add whitelist for allowed attributes on element ([ee9c516](https://github.com/Demivan/fluent-vue/commit/ee9c516d9080b95875676d887d0459ee8db9817f)), closes [#11](https://github.com/Demivan/fluent-vue/issues/11)
* **directive:** allow to not set element textContent from translations ([b4f67fd](https://github.com/Demivan/fluent-vue/commit/b4f67fd53d39793b1a7eb568acefcc58159cc412))
* **directive:** update translations when parameters change ([3c7dfe4](https://github.com/Demivan/fluent-vue/commit/3c7dfe4fd84501b7b6384616c869cc359f0ba28a))
* **method:** add a way to get message attrs ([48f68bb](https://github.com/Demivan/fluent-vue/commit/48f68bba266436c2d1a4b3374a1d9c3af58af465)), closes [#9](https://github.com/Demivan/fluent-vue/issues/9)
* refresh vue components when bundle list changes ([bfc3039](https://github.com/Demivan/fluent-vue/commit/bfc30394dfc83d7d470fb4d7051274e82c140bf8))
* **plugin:** allow passing multiple bundles to plugin ([699838f](https://github.com/Demivan/fluent-vue/commit/699838f92ee7d3c627e69f98995a3aefe4125327))


#### BREAKING CHANGES

* **plugin:** Instead on `bundle` option plugin now accepts `bundles` option with array of bundles



## v1.3.0 (2019-08-08)


#### Bug Fixes

* **directive:** fix localization when element does not have attributes ([a3581fd](https://github.com/Demivan/fluent-vue/commit/a3581fdc8e2dea8818f2ad6bf5924bf3880311e9))


#### Features

* **directive:** allow to localize attributes ([d395b42](https://github.com/Demivan/fluent-vue/commit/d395b42a7c6b685ddc12a0f0f797eec3c4e6406e))
* **directive:** simplify directive arguments ([ed4ccff](https://github.com/Demivan/fluent-vue/commit/ed4ccff91a00891183e7ad5d1ac7937e547d1979))



## v1.2.0 (2019-08-08)


#### Features

* **directive:** use directive argument for translation key ([c0bf0c7](https://github.com/Demivan/fluent-vue/commit/c0bf0c72a82c7098267f50b1a48fb6966a541204))



## v1.1.0 (2019-08-07)


#### Features

* **directive:** initial directive implementation ([31e4595](https://github.com/Demivan/fluent-vue/commit/31e45956e3a8fe54fae4c3f25a2f2f766cff3490))



## v1.0.0 (2019-08-07)


#### Bug Fixes

* **build:** fix coverage issue ([71841fb](https://github.com/Demivan/fluent-vue/commit/71841fb4d7d0d0b8d250096252c0ca862995ef20))
* **lint:** fix ts-lint warning ([20ca5be](https://github.com/Demivan/fluent-vue/commit/20ca5be399a61db3e6454f1329cef4ef03b33a63))



