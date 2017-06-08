import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLID
} from 'graphql'

export const PurchaseStatus = new GraphQLObjectType({
  name: 'PurchaseStatus',
  fields: {
    id: {
      type: GraphQLID
    },
    meta: {
      type: GraphQLString
    },
    name: {
      type: GraphQLString
    },
    color: {
      type: GraphQLString
    }
  }
})
