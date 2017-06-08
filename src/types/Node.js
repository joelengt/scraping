import {
  nodeDefinitions,
  fromGlobalId
} from 'graphql-relay'

let {
  nodeInterface: NodeInterface,
  nodeField: Node
} = nodeDefinitions(
  (globalId, {loaders}) => {
    let {type, id} = fromGlobalId(globalId)
    try {
      type = require(`./${type}`)[type]
      return loaders.node.load([type, id])
    } catch (err) {
      throw new Error(`Node Type ${type} doesn't exist`)
    }
  },
  obj => obj._type
)

export {
  Node,
  NodeInterface
}
