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
  GraphQLBoolean,
  GraphQLFloat
} from 'graphql'

export const CartProduct = new GraphQLObjectType({
  name: 'CartProduct',
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
    quantity: {
      type: GraphQLInt
    },
    price: {
      type: GraphQLString
    },
    name: {
      type: GraphQLString
    },
    photo: {
      type: GraphQLString
    },
    unit_price: {
      type: GraphQLFloat
    },
    is_featured: {
      type: GraphQLBoolean
    },
    is_archived: {
      type: GraphQLBoolean
    }
  }
})
