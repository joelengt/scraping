import sql from '../connectors'

import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLFloat,
  GraphQLBoolean,
  GraphQLList
} from 'graphql'

import { NodeInterface } from './Node'
import { Product } from './Product'
import { Ads } from './Ads'
import { Purchase } from './Purchase'
import { Cart } from './Cart'

import {
  idField
} from '../utils'

export const Partner = new GraphQLObjectType({
  name: 'Partner',
  interfaces: [NodeInterface],
  fields: {
    ...idField,
    name: {
      type: GraphQLString
    },
    name_slugify: {
      type: GraphQLString
    },
    logo: {
      type: GraphQLString
    },
    color: {
      type: GraphQLString
    },
    minimun_purchase: {
      type: GraphQLFloat
    },
    delivery_message: {
      type: GraphQLString
    },
    ads: {
      type: new GraphQLList(Ads),
      resolve: (obj) => {
        return sql('banner')
      }
    },
    is_featured: {
      type: GraphQLBoolean
    },
    products: {
      type: new GraphQLList(Product),
      resolve: (obj) => {
        return sql('business_partner_product as bpp')
        .where('business_partner_id', obj.id)
        .limit(20)
        .innerJoin('product', (qb) => {
          qb.on('product.id', 'bpp.product_id')
        })
      }
    },
    orders: {
      type: new GraphQLList(Purchase),
      resolve: (obj) => {
        return sql('purchase')
        .limit(10)
      }
    },
    carts: {
      type: new GraphQLList(Cart),
      resolve: (obj) => {
        return [
          {
            id: 1
          },
          {
            id: 2
          },
          {
            id: 3
          }
        ]
      }
    }
  }
})
