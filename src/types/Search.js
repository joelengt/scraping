import sql from '../connectors'

import { NodeInterface } from './Node'
import { Brand } from './Brand'
import { Product } from './Product'
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

export const Search = new GraphQLObjectType({
  name: 'Search',
  interfaces: [NodeInterface],
  fields: {
    ...idField,
    categories: {
      type: Category,
      resolve: (obj) => {
        return sql('category')
        .limit(1)
        .spread(noop)
      }
    },
    products: {
      type: new GraphQLList(Product),
      resolve: (obj) => {
        return [
          {
            id: 1,
            name: 'product 1',
            quantity: 10,
            unitPrice: 2.25,
            photo: 'http://happy_image.png',
            _price: 'S/10.25',
            price: 10.25
          },
          {
            id: 2,
            name: 'product 2',
            quantity: 5,
            unitPrice: 3.25,
            photo: 'http://happy_image2.png',
            _price: 'S/20.25',
            price: 20.25
          },
          {
            id: 3,
            name: 'product 3',
            quantity: 2,
            unitPrice: 25.25,
            photo: 'http://happy_image5.png',
            _price: 'S/20.55',
            price: 20.55
          }
        ]
      }
    }
  }
})
