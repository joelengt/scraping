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

export const Product = new GraphQLObjectType({
  name: 'Product',
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
    name_slugify: {
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
    seo_description: {
      type: GraphQLString
    },
    time_life: {
      type: GraphQLString
    },
    offer: {
      type: GraphQLFloat
    },
    price: {
      type: GraphQLFloat
    },
    unit_price: {
      type: GraphQLFloat
    },
    suggested_price: {
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
    need_perception: {
      type: GraphQLBoolean
    },
    is_always_in_stock: {
      type: GraphQLBoolean
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
    is_featured: {
      type: GraphQLBoolean
    },
    is_archived: {
      type: GraphQLBoolean
    }
  }
})
