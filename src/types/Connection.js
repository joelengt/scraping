import {
  noop
} from '../utils'

import {
  GraphQLObjectType,
  GraphQLInt,
  GraphQLBoolean,
  GraphQLList
} from 'graphql'

const PageInfo = new GraphQLObjectType({
  name: 'PageInfo',
  fields: () => ({
    count: {
      type: GraphQLInt
    },
    pages: {
      type: GraphQLInt
    },
    hasPrevPage: {
      type: GraphQLBoolean
    },
    hasNextPage: {
      type: GraphQLBoolean
    }
  })
})

export const connectionArguments = () => ({
  limit: {
    type: GraphQLInt
  },
  page: {
    type: GraphQLInt
  }
})

export const connectionWithExtras = nodeType => {
  let {name: nodeName} = nodeType
  let connectionName = `${nodeName}Connection`
  let edgeName = `${nodeName}Edge`

  const edge = new GraphQLObjectType({
    name: edgeName,
    fields: () => ({
      node: {
        type: nodeType,
        resolve: noop
      }
    })
  })

  const connection = new GraphQLObjectType({
    name: connectionName,
    fields: () => ({
      edges: {
        type: new GraphQLList(edge),
        resolve: parent => parent.edges
      },
      pageInfo: {
        type: PageInfo
      }
    })
  })

  return connection
}
