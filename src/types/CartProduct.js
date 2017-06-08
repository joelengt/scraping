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
  GraphQLList,
  GraphQLInt,
  GraphQLBoolean,
  GraphQLFloat
} from 'graphql'

export const CartProduct = new GraphQLObjectType({
  name: 'CartProduct',
  interfaces: [NodeInterface],
  fields: {
    ...idField,
    items: {
      type: new GraphQLList(Product),
      resolve: (obj) => {
        return sql('product')
        .limit(5)
      }
    },
    quantity: {
      type: GraphQLInt,
      resolve: (obj) => {
        return 23
      }
    },
    total: {
      type: GraphQLFloat,
      resolve: (obj) => {
        return 105.00
      }
    },
    _total: {
      type: GraphQLString,
      resolve: (obj) => {
        return 'S/105.00'
      }
    }
  }
})
