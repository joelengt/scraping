import {
  GraphQLEnumType
} from 'graphql'

export const BusinessTypeEnum = new GraphQLEnumType({
  name: 'BusinessTypeEnum',
  values: {
    CORNER_SHOP: {
      description: '',
      value: 1
    },
    BAKERY: {
      description: '',
      value: 2
    },
    TRUCK_FOOD: {
      description: '',
      value: 3
    },
    RESTAURANT: {
      description: '',
      value: 4
    },
    HOTEL: {
      description: '',
      value: 5
    },
    CATERING: {
      description: '',
      value: 6
    },
    BEER: {
      description: '',
      value: 7
    },
    KARAOKE: {
      description: '',
      value: 8
    }
  }
})
