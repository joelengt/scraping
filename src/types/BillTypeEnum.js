import {
  GraphQLEnumType
} from 'graphql'

export const BillTypeEnum = new GraphQLEnumType({
  name: 'BillTypeEnum',
  values: {
    BILL: {
      value: 'bill'
    },
    TICKET: {
      value: 'ticket'
    }
  }
})
