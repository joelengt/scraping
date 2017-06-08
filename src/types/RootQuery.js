import sql from '../connectors'

import {
  paginator,
  paymentMethodData,
  receiptTypeData
} from '../utils'

import {
  Node,
  // Purchase,
  // GoodsBatch,
  // User,
  // Searchable,
  // SearchEnum,
  // BusinessType,
  // ReceiptType,
  Product,
  // PurchaseStatus,
  // District,
  Brand,
  Category,
  Cart,
  CartProduct,
  // PaymentMethod,
  Ads,
  Partner
} from './'

import {
  connectionWithExtras,
  connectionArguments
} from './Connection'

import {
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
  GraphQLList
} from 'graphql'

const RootQuery = new GraphQLObjectType({
  name: 'RootQuery',
  fields: () => ({
    node: Node,
    cart: {
      type: connectionWithExtras(Cart),
      description: 'Cart',
      args: connectionArguments(),
      resolve: (obj, args, {user}, info) => {
        let qb = sql('product')
        .orderBy('id', 'DESC')
        .limit(10)

        return paginator(qb, 'product.id', args)
      }
    },
    cartProduct: {
      type: connectionWithExtras(CartProduct),
      description: 'CartProduct',
      args: connectionArguments(),
      resolve: (obj, args, {user}, info) => {
        let qb = sql('product')
        .orderBy('id', 'DESC')
        .limit(10)

        return paginator(qb, 'product.id', args)
      }
    },
    categories: {
      type: connectionWithExtras(Category),
      description: 'categories',
      args: connectionArguments(),
      resolve: (obj, args, {user}, info) => {
        let qb = sql('category')
        .orderBy('id', 'DESC')
        .where({level: 1})

        return paginator(qb, 'category.id', args)
      }
    },
    products: {
      type: connectionWithExtras(Product),
      description: 'products',
      args: connectionArguments(),
      resolve: (obj, args, {user}, info) => {
        let qb = sql('product')
        .orderBy('name', 'ASC')
        .orderBy('id', 'DESC')
        .orderBy('is_archived', 'ASC')
        return paginator(qb, 'product.id', args)
      }
    },
    brands: {
      type: connectionWithExtras(Brand),
      description: 'brands',
      args: connectionArguments(),
      resolve: (obj, args, {user}, info) => {
        let qb = sql('brand').orderBy('id', 'DESC')
        return paginator(qb, 'brand.id', args)
      }
    },
    ads: {
      type: connectionWithExtras(Ads),
      description: 'ads',
      args: connectionArguments(),
      resolve: (obj, args, {user}, info) => {
        let qb = sql('banner').orderBy('id', 'DESC')
        return paginator(qb, 'banner.id', args)
      }
    },
    partners: {
      type: connectionWithExtras(Partner),
      description: 'business partners',
      args: connectionArguments(),
      resolve: (obj, args, {user}, info) => {
        let qb = sql('business_partner').orderBy('id', 'DESC')
        return paginator(qb, 'business_partner.id', args)
      }
    }
  })
})

export default RootQuery
