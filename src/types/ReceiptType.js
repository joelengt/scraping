import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLID
} from 'graphql'

export const ReceiptType = new GraphQLObjectType({
  name: 'ReceiptType',
  fields: () => ({
    id: {
      type: GraphQLID
    },
    meta: {
      type: GraphQLString
    },
    name: {
      type: GraphQLString
    }
  })
})
