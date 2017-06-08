import {
  GraphQLNonNull,
  GraphQLString,
  GraphQLID,
  GraphQLFloat,
  GraphQLInputObjectType
} from 'graphql'

export const UserInput = new GraphQLInputObjectType({
  name: 'UserInput',
  fields: {
    name: {
      type: new GraphQLNonNull(GraphQLString)
    },
    last_name: {
      type: new GraphQLNonNull(GraphQLString)
    },
    email: {
      type: new GraphQLNonNull(GraphQLString)
    },
    password: {
      type: GraphQLString
    },
    phone: {
      type: new GraphQLNonNull(GraphQLFloat)
    },
    business_name: {
      type: new GraphQLNonNull(GraphQLString)
    },
    provider: {
      type: new GraphQLNonNull(GraphQLString)
    },
    business_type_id: {
      type: new GraphQLNonNull(GraphQLID)
    }
  }
})
