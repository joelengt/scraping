import {
  GraphQLNonNull,
  GraphQLString,
  GraphQLID,
  GraphQLFloat,
  GraphQLInt,
  GraphQLInputObjectType
} from 'graphql'

export const PurchaseItemInput = new GraphQLInputObjectType({
  name: 'PurchaseItemInput',
  fields: {
    product_id: {
      type: new GraphQLNonNull(GraphQLID)
    },
    name: {
      type: new GraphQLNonNull(GraphQLString)
    },
    presentation: {
      type: new GraphQLNonNull(GraphQLString)
    },
    photo: {
      type: new GraphQLNonNull(GraphQLString)
    },
    quantity: {
      type: new GraphQLNonNull(GraphQLInt)
    },
    price: {
      type: new GraphQLNonNull(GraphQLFloat)
    }
  }
})
