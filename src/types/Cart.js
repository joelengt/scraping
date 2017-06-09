import sql from '../connectors'

import { NodeInterface } from './Node'

import {
  idField,
  noop
} from '../utils'

import {CartProduct} from './CartProduct'
import {CartPrices} from './CartPrices'

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
    },
    quantity: {
      type: GraphQLInt,
      resolve: (obj) => {
        return 23
      }
    },
    prices: {
      type: CartPrices,
      resolve: (obj) => {
        return {
          id: 1
        }
      }
    }
  }
})
