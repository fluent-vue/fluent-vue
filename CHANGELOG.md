# [3.0.0-beta.4](https://github.com/Demivan/fluent-vue/compare/v3.0.0-beta.3...v3.0.0-beta.4) (2020-12-21)


### Features

* add hmr to fluent-vue-loader ([4c05f49](https://github.com/Demivan/fluent-vue/commit/4c05f4980ec5d3b9b5071dc2ee5de774d6f79bcc))



# [3.0.0-beta.3](https://github.com/Demivan/fluent-vue/compare/v3.0.0-beta.2...v3.0.0-beta.3) (2020-11-26)


### Bug Fixes

* allow $ta method to work without text  ([#170](https://github.com/Demivan/fluent-vue/issues/170)) ([5597392](https://github.com/Demivan/fluent-vue/commit/5597392784c8ab4b6f60c3570f97050e8ae5b973))
* i18n component not working with message overrides ([#236](https://github.com/Demivan/fluent-vue/issues/236)) ([7b3c170](https://github.com/Demivan/fluent-vue/commit/7b3c170a3a17f43f91e948cae5a5f5061518f564))



# [3.0.0-beta.2](https://github.com/Demivan/fluent-vue/compare/v3.0.0-beta.1...v3.0.0-beta.2) (2020-10-08)



# [3.0.0-beta.1](https://github.com/Demivan/fluent-vue/compare/v3.0.0-beta.0...v3.0.0-beta.1) (2020-10-08)


### Bug Fixes

* **types:** fix typescript definitions ([#160](https://github.com/Demivan/fluent-vue/issues/160)) ([b1985b7](https://github.com/Demivan/fluent-vue/commit/b1985b7f516719da9a72acfaca0dc2116f6d87f3))


### Features

* add support for Vue 3 ([#158](https://github.com/Demivan/fluent-vue/issues/158)) ([aa06933](https://github.com/Demivan/fluent-vue/commit/aa06933dbaa3f363e0e0e02bc27c290c04582a9b))



# [3.0.0-beta.0](https://github.com/Demivan/fluent-vue/compare/v3.0.0-alpha.3...v3.0.0-beta.0) (2020-08-02)



# [3.0.0-alpha.3](https://github.com/Demivan/fluent-vue/compare/v3.0.0-alpha.2...v3.0.0-alpha.3) (2020-08-02)


### Bug Fixes

* do not remove root context ([de1042f](https://github.com/Demivan/fluent-vue/commit/de1042f430a24e771364197913d99436d71c55e0))



# [3.0.0-alpha.2](https://github.com/Demivan/fluent-vue/compare/v3.0.0-alpha.1...v3.0.0-alpha.2) (2020-08-02)


### Bug Fixes

* bring back ability to dynamically add bundles ([e1360d3](https://github.com/Demivan/fluent-vue/commit/e1360d3af87faa2f6f3317dce10bda4ab1c8c04a))



# [3.0.0-alpha.1](https://github.com/Demivan/fluent-vue/compare/v3.0.0-alpha.0...v3.0.0-alpha.1) (2020-08-02)



# [3.0.0-alpha.0](https://github.com/Demivan/fluent-vue/compare/v2.4.5...v3.0.0-alpha.0) (2020-07-12)


### Code Refactoring

* add 'locale' option for selecting locale ([56a1aac](https://github.com/Demivan/fluent-vue/commit/56a1aac24326050ef8713b078477f13df63c2c9f))
* change how plugin is initialized ([da7728f](https://github.com/Demivan/fluent-vue/commit/da7728fc8249f8ddd039960c354685542cb06076))


### Features

* **loader:** add webpack fluent-vue-loader ([69e5423](https://github.com/Demivan/fluent-vue/commit/69e54230125d2e92b897d9f8d99d881e6a20210e))


### BREAKING CHANGES

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



## [2.4.5](https://github.com/Demivan/fluent-vue/compare/v2.4.4...v2.4.5) (2020-04-13)


### Bug Fixes

* **package:** update yarn.lock to reduce vulnerabilities ([faae0be](https://github.com/Demivan/fluent-vue/commit/faae0bedf93d7d0650b46f9d4fcdfbc6b3d30abb))



## [2.4.4](https://github.com/Demivan/fluent-vue/compare/v2.4.3...v2.4.4) (2020-04-13)


### Bug Fixes

* package.json & yarn.lock to reduce vulnerabilities ([#59](https://github.com/Demivan/fluent-vue/issues/59)) ([8f61162](https://github.com/Demivan/fluent-vue/commit/8f6116219ce0666cbe59df22206944f8830b312c))



## [2.4.3](https://github.com/Demivan/fluent-vue/compare/v2.4.2...v2.4.3) (2020-03-07)


### Bug Fixes

* **package:** update @fluent/dedent to version 0.2.0 ([2363355](https://github.com/Demivan/fluent-vue/commit/23633550b03b1a2dd712a2774c5a42f947a42025))
* **package:** update @fluent/sequence to version 0.5.0 ([27e5d23](https://github.com/Demivan/fluent-vue/commit/27e5d23718675a6e8dc579405bc08ed2ab6d10ec))



## [2.4.2](https://github.com/Demivan/fluent-vue/compare/v2.4.1...v2.4.2) (2020-02-18)


### Bug Fixes

* reduce bundle size by not bundling npm dependencies ([6faca34](https://github.com/Demivan/fluent-vue/commit/6faca34da3e60fd5e881c8114bd9400e4e807914))
* **types:** improve typescript type definitions ([a07a8e3](https://github.com/Demivan/fluent-vue/commit/a07a8e3e3d6a97d25a5cc1ff8e54c3ddab0c263c))



## [2.4.1](https://github.com/Demivan/fluent-vue/compare/v2.4.0...v2.4.1) (2020-02-16)


### Bug Fixes

* **package:** make @fluent/bundle a peer dependency and @fluent/dedent a dev dependency ([14c487c](https://github.com/Demivan/fluent-vue/commit/14c487ca33fec7b9b9a544f74b1db221d08331d8)), closes [#43](https://github.com/Demivan/fluent-vue/issues/43)
* **package:** update @fluent/bundle to version 0.15.0 ([2991da9](https://github.com/Demivan/fluent-vue/commit/2991da94922cfa8ccff216f9de2efd90a2b21cbb))


### Features

* **component:** add component for component interpolation ([79bac0a](https://github.com/Demivan/fluent-vue/commit/79bac0af6afc51cdb5f33461b07fb456c6618134))
* **directive:** add whitelist for allowed attributes on element ([ee9c516](https://github.com/Demivan/fluent-vue/commit/ee9c516d9080b95875676d887d0459ee8db9817f)), closes [#11](https://github.com/Demivan/fluent-vue/issues/11)
* **directive:** allow to not set element textContent from translations ([b4f67fd](https://github.com/Demivan/fluent-vue/commit/b4f67fd53d39793b1a7eb568acefcc58159cc412))
* **directive:** update translations when parameters change ([3c7dfe4](https://github.com/Demivan/fluent-vue/commit/3c7dfe4fd84501b7b6384616c869cc359f0ba28a))
* **method:** add a way to get message attrs ([48f68bb](https://github.com/Demivan/fluent-vue/commit/48f68bba266436c2d1a4b3374a1d9c3af58af465)), closes [#9](https://github.com/Demivan/fluent-vue/issues/9)
* refresh vue components when bundle list changes ([bfc3039](https://github.com/Demivan/fluent-vue/commit/bfc30394dfc83d7d470fb4d7051274e82c140bf8))
* **plugin:** allow passing multiple bundles to plugin ([699838f](https://github.com/Demivan/fluent-vue/commit/699838f92ee7d3c627e69f98995a3aefe4125327))


### BREAKING CHANGES

* **plugin:** Instead on `bundle` option plugin now accepts `bundles` option with array of bundles



# [1.3.0](https://github.com/Demivan/fluent-vue/compare/v1.2.0...v1.3.0) (2019-08-08)


### Bug Fixes

* **directive:** fix localization when element does not have attributes ([a3581fd](https://github.com/Demivan/fluent-vue/commit/a3581fdc8e2dea8818f2ad6bf5924bf3880311e9))


### Features

* **directive:** allow to localize attributes ([d395b42](https://github.com/Demivan/fluent-vue/commit/d395b42a7c6b685ddc12a0f0f797eec3c4e6406e))
* **directive:** simplify directive arguments ([ed4ccff](https://github.com/Demivan/fluent-vue/commit/ed4ccff91a00891183e7ad5d1ac7937e547d1979))



# [1.2.0](https://github.com/Demivan/fluent-vue/compare/v1.1.0...v1.2.0) (2019-08-08)


### Features

* **directive:** use directive argument for translation key ([c0bf0c7](https://github.com/Demivan/fluent-vue/commit/c0bf0c72a82c7098267f50b1a48fb6966a541204))



# [1.1.0](https://github.com/Demivan/fluent-vue/compare/v1.0.0...v1.1.0) (2019-08-07)


### Features

* **directive:** initial directive implementation ([31e4595](https://github.com/Demivan/fluent-vue/commit/31e45956e3a8fe54fae4c3f25a2f2f766cff3490))



# [1.0.0](https://github.com/Demivan/fluent-vue/compare/20ca5be399a61db3e6454f1329cef4ef03b33a63...v1.0.0) (2019-08-07)


### Bug Fixes

* **build:** fix coverage issue ([71841fb](https://github.com/Demivan/fluent-vue/commit/71841fb4d7d0d0b8d250096252c0ca862995ef20))
* **lint:** fix ts-lint warning ([20ca5be](https://github.com/Demivan/fluent-vue/commit/20ca5be399a61db3e6454f1329cef4ef03b33a63))



