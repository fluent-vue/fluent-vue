import { FluentBundle, ftl as tag } from 'fluent'

// import "core-js"

export const bundle = new FluentBundle('en-US', {
  useIsolating: false
})

export const ftl = tag
