import sql from '../connectors'

import { NodeInterface } from './Node'

import {
  idField,
  noop
} from '../utils'

import {CartProduct} from './CartProduct'

import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLList,
  GraphQLInt,
  GraphQLBoolean,
  GraphQLFloat
} from 'graphql'

export const Cart = new GraphQLObjectType({
  name: 'Cart',
  interfaces: [NodeInterface],
  fields: {
    ...idField,
    items: {
      type: new GraphQLList(CartProduct),
      resolve: (obj) => {
        return [
          {
            id: 1,
            name: 'product 1',
            quantity: 10,
            unit_price: 2.25
          },
          {
            id: 2,
            name: 'product 2',
            quantity: 5,
            unit_price: 3.25
          },
          {
            id: 3,
            name: 'product 3',
            quantity: 2,
            unit_price: 25.25
          }
        ]
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
    igv: {
      type: GraphQLFloat,
      resolve: (obj) => {
        return 23.00
      }
    },
    _igv: {
      type: GraphQLString,
      resolve: (obj) => {
        return 'S/23.00'
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
