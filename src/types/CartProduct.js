import sql from '../connectors'

import { NodeInterface } from './Node'
import { Brand } from './Brand'
import { Category } from './Category'

import {
  noop,
  idField
} from '../utils'

import {
  GraphQLObjectType,
  GraphQLInt,
  GraphQLFloat,
  GraphQLString,
  GraphQLBoolean,
  GraphQLList
} from 'graphql'

export const CartProduct = new GraphQLObjectType({
  name: 'CartProduct',
  interfaces: [NodeInterface],
  fields: {
    ...idField,
    brand: {
      type: Brand,
      resolve: (obj) => {
        return sql('brand')
        .where('id', obj.brand_id)
        .limit(1)
        .spread(noop)
      }
    },
    sku: {
      type: GraphQLString
    },
    name: {
      type: GraphQLString
    },
    nameSlugify: {
      type: GraphQLString
    },
    photo: {
      type: GraphQLString
    },
    presentation: {
      type: GraphQLString
    },
    description: {
      type: GraphQLString
    },
    seoDescription: {
      type: GraphQLString
    },
    timeLife: {
      type: GraphQLString
    },
    offer: {
      type: GraphQLFloat
    },
    price: {
      type: GraphQLFloat
    },
    _price: {
      type: GraphQLString
    },
    unitPrice: {
      type: GraphQLFloat
    },
    _unitPrice: {
      type: GraphQLString
    },
    suggestedPrice: {
      type: GraphQLFloat
    },
    stock: {
      type: GraphQLInt
    },
    popularity: {
      type: GraphQLInt
    },
    order: {
      type: GraphQLInt
    },
    needPerception: {
      type: GraphQLBoolean
    },
    isAlwaysInStock: {
      type: GraphQLBoolean
    },
    quantity: {
      type: GraphQLInt
    },
    categories: {
      type: new GraphQLList(Category),
      resolve: (obj) => {
        return sql('product_category as pc')
        .where('product_id', obj.id)
        .innerJoin('category', (qb) => {
          qb.on('category.id', 'pc.category_id')
        })
      }
    },
    isFeatured: {
      type: GraphQLBoolean
    },
    isArchived: {
      type: GraphQLBoolean
    }
  }
})
