import sql from '../connectors'

import { NodeInterface } from './Node'

import {
  idField,
  noop
} from '../utils'

import {Product} from './Product'

import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLBoolean
} from 'graphql'

export const Cart = new GraphQLObjectType({
  name: 'Cart',
  interfaces: [NodeInterface],
  fields: {
    ...idField,
    product: {
      type: Product,
      resolve: (obj) => {
        return sql('product')
        .limit(5)
        .spread(noop)
      }
    },
    partner_id: {
      type: GraphQLInt
    },
    is_featured: {
      type: GraphQLBoolean
    },
    is_archived: {
      type: GraphQLBoolean
    }
  }
})
