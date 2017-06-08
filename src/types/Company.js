import { NodeInterface } from './Node'

import {
  idField
} from '../utils'

import {
  GraphQLObjectType,
  GraphQLString
} from 'graphql'

export const Company = new GraphQLObjectType({
  name: 'Company',
  interfaces: [NodeInterface],
  fields: {
    ...idField,
    name: {
      type: GraphQLString
    }
  }
})
