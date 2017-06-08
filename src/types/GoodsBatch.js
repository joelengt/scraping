import moment from 'moment'
import GraphQLDate from 'graphql-date'
import sql from '../connectors'

import { NodeInterface } from './Node'
import { Product } from './Product'

import {
  noop,
  numeral,
  idField
} from '../utils'

import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLBoolean,
  GraphQLInt,
  GraphQLFloat
} from 'graphql'

export const GoodsBatch = new GraphQLObjectType({
  name: 'GoodsBatch',
  interfaces: [NodeInterface],
  fields: {
    ...idField,
    product: {
      type: Product,
      resolve: (obj) => {
        return sql('product')
        .where('id', obj.product_id)
        .limit(1)
        .spread(noop)
      }
    },
    price: {
      type: GraphQLFloat
    },
    _price: {
      type: GraphQLString,
      resolve: (obj) => numeral(obj.price).format()
    },
    quantity: {
      type: GraphQLInt
    },
    entered_at: {
      type: GraphQLDate,
      resolve: (obj) => moment(obj.entered_at).toDate()
    },
    expires_at: {
      type: GraphQLDate,
      resolve: (obj) => moment(obj.expires_at).toDate()
    },
    has_expired: {
      type: GraphQLBoolean,
      resolve: (obj) => {
        let expiresAt = moment(obj.expires_at)
        let now = moment()

        return expiresAt.diff(now, 'days') <= 0
      }
    }
  }
})
