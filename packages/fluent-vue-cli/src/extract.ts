import type { SFCBlock } from '@vue/compiler-sfc'
import type { SFCFileInfo, SFCFluentBlock } from './types'

import { getMessages } from './ftl'
import { getDescriptor } from './vue'

export default function extract (file: SFCFileInfo): SFCFluentBlock[] {
  const descriptor = getDescriptor(file)
  descriptor.customBlocks.sort((a, b) => {
    return a.loc.start.offset - b.loc.start.offset
  })
  return extractFromCustomBlocks(descriptor.customBlocks)
}

function extractFromCustomBlocks (blocks: SFCBlock[]): SFCFluentBlock[] {
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
      messages: getMessages(block.content)
    }
  }).filter(Boolean) as SFCFluentBlock[]
}
