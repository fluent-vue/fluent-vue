import type { Pattern } from '@fluent/syntax'

import { parse, serialize, FluentSerializer, Message, Identifier } from '@fluent/syntax'

const serializer = new FluentSerializer()

function getText (entry: Message): string {
  entry.comment = null
  return serializer.serializeEntry(entry).substring(entry.id.name.length + 3).trimEnd()
}

export function getMessages (content: string): Record<string, string> {
  return parse(content, { withSpans: false }).body
    .reduce<Record<string, string>>((entries, entry) => {
    if (entry instanceof Message) {
      entries[entry.id.name] = getText(entry)
    }
    return entries
  }, {})
}

export function merge (ftlSource: string, messages: Record<string, string>): string {
  const currentResourse = parse(ftlSource, { withSpans: true })

  for (const [key, value] of Object.entries(messages)) {
    const resourceString = `${key} = ${value}`
    const resource = parse(resourceString, { withSpans: false })

    let updated = false
    for (const message of currentResourse.body) {
      if (message instanceof Message && message.id.name === key) {
        updated = true
        message.value = resource.body[0].value as Pattern
      }
    }

    if (!updated) {
      const newMessage = new Message(
        new Identifier(key),
        resource.body[0].value as Pattern)
      currentResourse.body.push(newMessage)
    }
  }

  return serialize(currentResourse, { withJunk: true })
}
