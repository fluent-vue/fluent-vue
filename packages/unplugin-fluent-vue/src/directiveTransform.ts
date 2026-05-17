import type { DirectiveTransform } from '@vue/compiler-core'
import { createCompoundExpression, createSimpleExpression, NodeTypes } from '@vue/compiler-core'

export const directiveTransform: DirectiveTransform = (dir, node, context) => {
  const baseCode = `${context.prefixIdentifiers ? '_ctx.' : ''}`

  if (!dir.arg) {
    console.error(`[fluent-vue] Missing key argument for v-t directive`)
    return {
      props: [],
      needRuntime: true,
    }
  }

  const paramsExpr = dir.exp
    ? createCompoundExpression([dir.arg, createSimpleExpression(`, `, false), dir.exp])
    : dir.arg

  node.children = [
    {
      type: NodeTypes.INTERPOLATION,
      content: createCompoundExpression([
        createSimpleExpression(`${baseCode}$t(`, false),
        paramsExpr,
        createSimpleExpression(`)`, false),
      ]),
      loc: node.loc,
    },
  ]

  return {
    props: [],
    needRuntime: true,
  }
}
