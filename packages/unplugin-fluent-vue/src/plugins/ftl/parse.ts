import type { Junk } from '@fluent/syntax'
import { columnOffset, lineOffset, parse } from '@fluent/syntax'

function padRight(str: string | number, len: number) {
  return str + ' '.repeat(len - String(str).length)
}

const RANGE = 2

/**
 * Generate a string that highlights the position of the error in the source
 * @param source The source string
 * @param line The line number of the error (1-indexed)
 * @param column The column number of the error (1-indexed)
 * Example:
 * |  proper-key = Value
 * |  key-with-error = error  {->
 * |                            ^
 * |  continuation = Value
 */
export function generateCodeFrame(
  source: string,
  line: number,
  column: number,
): string {
  const lines = source.split(/\r?\n/)
  const start = Math.max(line - RANGE - 1, 0)
  const end = Math.min(lines.length, line + RANGE)

  const result = []

  const lineNumberLength = String(end).length

  for (let i = start; i < end; i++) {
    result.push(`${padRight(i + 1, lineNumberLength)} |  ${lines[i]}`)

    if (i + 1 === line)
      result.push(`${padRight(' ', lineNumberLength)} |  ${' '.repeat(column - 1)}^`)
  }

  return result.join('\n')
}

export function getSyntaxErrors(
  source: string,
): string | undefined {
  const parsed = parse(source, { withSpans: true })
  const junks = parsed.body.filter(x => x.type === 'Junk') as Junk[]
  const errors = junks.map(x => x.annotations).flat()
  if (errors.length > 0) {
    const errorsText = errors.map((x) => {
      const line = lineOffset(source, x.span.start) + 1
      const column = columnOffset(source, x.span.start) + 1
      return `    ${x.code}: ${x.message} (${line}:${column})
${generateCodeFrame(source, line, column)}`
    }).join('\n')

    return `Fluent parse errors:\n${errorsText}`
  }

  return undefined
}
