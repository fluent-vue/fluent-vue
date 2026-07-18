# Importing .ftl files

In addition to using Vue custom blocks to define localization messages, it is possible to import them from .ftl files. This allows for easier integration with localization services, for example Mozilla's [Pontoon](https://github.com/mozilla/pontoon). Check `ExternalFluentPlugin` in [unplugin-fluent-vue](/integrations/unplugin) for more details.

Enabling `ExternalFluentPlugin` additionally allows to import .ftl files as `FluentResource` objects and add them to the bundle using `bundle.addResource`. This allows you to have shared translation files for all your Vue components:

```js
import { FluentBundle, FluentResource } from '@fluent/bundle'

import enMessages from './en.ftl'

const enBundle = new FluentBundle('en')
enBundle.addResource(enMessages)
```

Incase you are not using `ExternalFluentPlugin` you will need to configure your build system to support importing .ftl files as raw strings (*I may move this logic to a separate plugin in the future*):

### Webpack

For Webpack 5 you need to set .ftl files to be `type: 'asset/source'`. In earlier Webpack versions, this was done using `raw-loader`.

```js
module: {
  rules: [
    ...,
    {
      test: /\.ftl$/,
      type: 'asset/source'
    }
  ]
}
```

### Vite

For Vite you need to add `?raw` to your .ftl file imports to import them as strings.

```js
import { FluentBundle, FluentResource } from '@fluent/bundle'

import enMessages from './en.ftl?raw'

const enBundle = new FluentBundle('en')
enBundle.addResource(new FluentResource(enMessages))
```

If you use Vite for local development and another bundler like Rollup for production bundling, it might be that `?raw` won't be supported there. In that case you can use the [vite-raw-plugin](https://www.npmjs.com/package/vite-raw-plugin) to import all `.ftl` files as raw without the `?raw` flag:

```js
import viteRawPlugin from 'vite-raw-plugin'

export default {
  ...
  plugins: [
    ...,
    viteRawPlugin({
      fileRegex: /\.ftl/,
    }),
  ]
}
```

### Rollup

For Rollup you can use the [rollup-plugin-string](https://www.npmjs.com/package/rollup-plugin-string) plugin and add a rule for importing `.ftl` files as strings:

```js
import { string } from 'rollup-plugin-string'

export default {
  ...
  plugins: [
    ...,
    string({
      include: /\.ftl$/i,
    }),
  ],
};
```
