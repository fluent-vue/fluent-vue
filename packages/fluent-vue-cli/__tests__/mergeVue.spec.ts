import { readFile } from 'fs/promises'
import { resolve } from 'path'

import { mergeVue } from '../src'

describe('mergeVue', () => {
  it('adds new key/values', async () => {
    // Arrange
    const source = await readFile(resolve(__dirname, 'fixtures', './Simple.vue'))
    const newTranslation = { hello: 'Hello' }

    // Act
    const newSource = mergeVue(source.toString(), 'en', newTranslation)

    // Assert
    expect(newSource).toMatchInlineSnapshot(`
"<template>
  <div>
    {{ $t('greeting', { name: 'World' }) }}
  </div>
</template>

<script>
export default {
}
</script>

<fluent locale=\\"en\\">
user-name = World
aria-key = Aria value
greeting = Hello, { $name }
    .aria-label = Label value
hello = Hello
</fluent>
"
`)
  })

  it('adds new block for new locale', async () => {
    // Arrange
    const source = await readFile(resolve(__dirname, 'fixtures', './Simple.vue'))
    const newTranslation = { hello: 'Hello' }

    // Act
    const newSource = mergeVue(source.toString(), 'uk', newTranslation)

    // Assert
    expect(newSource).toMatchInlineSnapshot(`
"<template>
  <div>
    {{ $t('greeting', { name: 'World' }) }}
  </div>
</template>

<script>
export default {
}
</script>

<fluent locale=\\"en\\">
user-name = World
aria-key = Aria value
greeting = Hello, {$name}
  .aria-label = Label value
</fluent>

<fluent locale=\\"uk\\">
hello = Hello
</fluent>
"
`)
  })

  it('adds new fluent block at the end', async () => {
    // Arrange
    const source = `
<template>
  <div>
    {{ $t('greeting', { name: 'World' }) }}
  </div>
</template>

<script>
export default {
}
</script>
`
    const newTranslation = { hello: 'Hello' }

    // Act
    const newSource = mergeVue(source.toString(), 'en', newTranslation)

    // Assert
    expect(newSource).toMatchInlineSnapshot(`
"
<template>
  <div>
    {{ $t('greeting', { name: 'World' }) }}
  </div>
</template>

<script>
export default {
}
</script>

<fluent locale=\\"en\\">
hello = Hello
</fluent>
"
`)
  })

  it('add block after last fluent block', async () => {
    // Arrange
    const source = `
<template>
  <div>
    {{ $t('greeting', { name: 'World' }) }}
  </div>
</template>

<script>
export default {
}
</script>

<fluent locale="en">
user-name = World
</fluent>

<style>
.test { display: none; }
</style>
`
    const newTranslation = { hello: 'Hello' }

    // Act
    const newSource = mergeVue(source.toString(), 'uk', newTranslation)

    // Assert
    expect(newSource).toMatchInlineSnapshot(`
"
<template>
  <div>
    {{ $t('greeting', { name: 'World' }) }}
  </div>
</template>

<script>
export default {
}
</script>

<fluent locale=\\"en\\">
user-name = World
</fluent>

<fluent locale=\\"uk\\">
hello = Hello
</fluent>

<style>
.test { display: none; }
</style>
"
`)
  })

  it('does not ignore empty blocks', async () => {
    // Arrange
    const source = `
<template>
  <div>
    {{ $t('greeting', { name: 'World' }) }}
  </div>
</template>

<script>
export default {
}
</script>

<fluent locale="en">
</fluent>

<style>
</style>
`
    const newTranslation = { hello: 'Hello' }

    // Act
    const newSource = mergeVue(source.toString(), 'uk', newTranslation)

    // Assert
    expect(newSource).toMatchInlineSnapshot(`
"
<template>
  <div>
    {{ $t('greeting', { name: 'World' }) }}
  </div>
</template>

<script>
export default {
}
</script>

<fluent locale=\\"en\\">
</fluent>

<fluent locale=\\"uk\\">
hello = Hello
</fluent>

<style>
</style>
"
`)
  })
})
