import {
  GraphQLEnumType
} from 'graphql'

export const SearchEnum = new GraphQLEnumType({
  name: 'SearchEnum',
  values: {
    PRODUCT: {
      value: 'product'
    },
    USER: {
      value: 'user'
    },
    BRAND: {
      value: 'brand'
    },
    CATEGORY: {
      value: 'category'
    },
    BUSINESS_PARTNER: {
      value: 'business_partner'
    }
  }
})
