import sql from '../connectors'

import {
  numeral,
  noop
} from '../utils'

import {Product} from './Product'

import {
  GraphQLObjectType,
  GraphQLID,
  GraphQLInt,
  GraphQLFloat,
  GraphQLString
} from 'graphql'

export const PurchaseItem = new GraphQLObjectType({
  name: 'PurchaseItem',
  fields: {
    id: {
      type: GraphQLID
    },
    product_id: {
      type: GraphQLID
    },
    product: {
      type: Product,
      resolve: (obj) => sql('product').where({id: obj.product_id}).limit(1).spread(noop)
    },
    name: {
      type: GraphQLString
    },
    presentation: {
      type: GraphQLString
    },
    photo: {
      type: GraphQLString
    },
    quantity: {
      type: GraphQLInt
    },
    price: {
      type: GraphQLFloat
    },
    _price: {
      type: GraphQLString,
      resolve: obj => numeral(obj.price).format()
    },
    offer: {
      type: GraphQLFloat
    },
    _offer: {
      type: GraphQLString,
      resolve: obj => numeral(obj.offer).format()
    }
  }
})
