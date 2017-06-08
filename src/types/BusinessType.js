import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLID
} from 'graphql'

export const BusinessType = new GraphQLObjectType({
  name: 'BusinessType',
  fields: {
    id: {
      type: GraphQLID
    },
    meta: {
      type: GraphQLString
    },
    name: {
      type: GraphQLString
    }
  }
})
