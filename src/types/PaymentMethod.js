import {
  idField
} from '../utils'

import { NodeInterface } from './Node'

import {
  GraphQLObjectType,
  GraphQLString
} from 'graphql'

export const PaymentMethod = new GraphQLObjectType({
  name: 'PaymentMethod',
  interfaces: [NodeInterface],
  fields: () => ({
    ...idField,
    meta: {
      type: GraphQLString
    },
    name: {
      type: GraphQLString
    }
  })
})
