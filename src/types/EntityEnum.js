import {
  GraphQLEnumType
} from 'graphql'

export const EntityEnum = new GraphQLEnumType({
  name: 'EntityEnum',
  values: {
    PURCHASES: {
      value: 'purchases'
    },
    PRODUCTS: {
      value: 'products'
    },
    USERS: {
      value: 'users'
    },
    GOODS_BATCH: {
      value: 'goods_batch'
    }
  }
})
