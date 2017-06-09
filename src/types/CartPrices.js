import sql from '../connectors'

import { NodeInterface } from './Node'

import {
  idField,
  noop
} from '../utils'

import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLList,
  GraphQLInt,
  GraphQLBoolean,
  GraphQLFloat
} from 'graphql'

export const CartPrices = new GraphQLObjectType({
  name: 'CartPrices',
  interfaces: [NodeInterface],
  fields: {
    ...idField,
    subTotal: {
      type: GraphQLFloat,
      resolve: (obj) => {
        return 109.66
      }
    },
    _subTotal: {
      type: GraphQLString,
      resolve: (obj) => {
        return 'S/109.66'
      }
    },
    igv: {
      type: GraphQLFloat,
      resolve: (obj) => {
        return 19.74
      }
    },
    _igv: {
      type: GraphQLString,
      resolve: (obj) => {
        return 'S/19.74'
      }
    },
    total: {
      type: GraphQLFloat,
      resolve: (obj) => {
        return 129.4
      }
    },
    _total: {
      type: GraphQLString,
      resolve: (obj) => {
        return 'S/129.40'
      }
    },
    minimumOrder: {
      type: GraphQLFloat,
      resolve: (obj) => {
        return 100.00
      }
    },
    _minimumOrder: {
      type: GraphQLString,
      resolve: (obj) => {
        return 'S/100'
      }
    }
  }
})
