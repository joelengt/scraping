import { NodeInterface } from './Node'

import {
  idField
} from '../utils'

import {
  GraphQLObjectType,
  GraphQLString
} from 'graphql'

const District = new GraphQLObjectType({
  name: 'District',
  interfaces: [NodeInterface],
  fields: {
    ...idField,
    name: {
      type: GraphQLString
    }
  }
})

export {District}
