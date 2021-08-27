import type { SFCBlock, SFCDescriptor } from '@vue/compiler-sfc'
import type { SFCFileInfo } from './types'

import { parse } from '@vue/compiler-sfc'
import { merge as mergeFtl } from './ftl'

export function getDescriptor (file: SFCFileInfo): SFCDescriptor {
  return parse(file.content, {
    filename: file.path
  }).descriptor
}

export function merge (file: SFCFileInfo, locale: string, messages: Record<string, string>): string {
  const parseResult = getDescriptor(file)

  let fluentBlock = parseResult.customBlocks
    .find(block => block.type === 'fluent' && block.attrs.locale === locale)

  if (fluentBlock != null) {
    const newBlockContent = mergeFtl(fluentBlock.content, messages)
    fluentBlock.content = newBlockContent
  } else {
    fluentBlock = {
      type: 'fluent',
      attrs: {
        locale: locale
      },
      content: mergeFtl('', messages)
    } as unknown as SFCBlock
  }

  // Write back
  const blocks = getBlocks(parseResult)
  return buildContent(fluentBlock, parseResult.source, blocks)
}

function getBlocks (descriptor: SFCDescriptor): SFCBlock[] {
  const { template, script, styles, customBlocks } = descriptor
  const blocks: SFCBlock[] = [...styles, ...customBlocks]
  ;(template != null) && blocks.push(template as SFCBlock)
  ;(script != null) && blocks.push(script as SFCBlock)
  blocks.sort((a, b) => {
    return a.loc.start.offset - b.loc.start.offset
  })
  return blocks
}

function buildContent (blockToAdd: SFCBlock, raw: string, blocks: SFCBlock[]): string {
  let offset = 0
  let inserted = false
  let contents: string[] = []
  let fluentOffset = -1

  contents = blocks.reduce((contents, block) => {
    if (block.type === 'fluent' && block.attrs.locale === blockToAdd.attrs.locale) {
      contents = contents.concat(raw.slice(offset, block.loc.start.offset))
      contents = contents.concat(`\n${blockToAdd.content}`)
      offset = block.loc.end.offset
      inserted = true
    } else {
      contents = contents.concat(raw.slice(offset, block.loc.end.offset))
      offset = block.loc.end.offset

      if (block.type === 'fluent') {
        fluentOffset = contents.length
      }
    }
    return contents
  }, contents)

  contents = contents.concat(raw.slice(offset, raw.length))

  if (!inserted) {
    const content = `\n<fluent locale="${blockToAdd.attrs.locale as string}">\n${blockToAdd.content}</fluent>\n`

    if (fluentOffset !== -1) {
      contents.splice(fluentOffset, 0, content)
    } else {
      contents.push(content)
    }
  }

  return contents.join('')
}
