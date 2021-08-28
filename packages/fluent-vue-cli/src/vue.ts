import type { SFCBlock, SFCDescriptor } from '@vue/compiler-sfc'
import type { MessagesWithLocale } from './types'

import { parse } from '@vue/compiler-sfc'
import { merge as mergeFtl, getMessages as getFtlMessages } from './ftl'

export function getMessages (source: string): MessagesWithLocale[] {
  const descriptor = getDescriptor(source)
  descriptor.customBlocks.sort((a, b) => {
    return a.loc.start.offset - b.loc.start.offset
  })
  return extractFromCustomBlocks(descriptor.customBlocks)
}

export function merge (source: string, locale: string, messages: Record<string, string>): string {
  const parseResult = getDescriptor(source)

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

function getDescriptor (source: string): SFCDescriptor {
  return parse(source, {
    sourceMap: false,
    ignoreEmpty: false,
    pad: false
  }).descriptor
}

function extractFromCustomBlocks (blocks: SFCBlock[]): MessagesWithLocale[] {
  return blocks.map(block => {
    if (block.type !== 'fluent') {
      return undefined
    }

    const locale = block.attrs.locale
    if (locale == null || typeof locale !== 'string') {
      throw new Error('fluent custom block does not have locale specified')
    }

    return {
      locale,
      messages: getFtlMessages(block.content)
    }
  }).filter(Boolean) as MessagesWithLocale[]
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
        fluentOffset = contents.join('').length + '</fluent>\n'.length
      }
    }
    return contents
  }, contents)

  contents = contents.concat(raw.slice(offset, raw.length))

  let source = contents.join('')

  if (!inserted) {
    const content = `\n<fluent locale="${blockToAdd.attrs.locale as string}">\n${blockToAdd.content}</fluent>\n`

    if (fluentOffset !== -1) {
      source = source.slice(0, fluentOffset) + content + source.slice(fluentOffset)
    } else {
      source = source + content
    }
  }

  return source
}
