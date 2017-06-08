import {
  GraphQLNonNull,
  GraphQLString,
  GraphQLID,
  GraphQLFloat,
  GraphQLInputObjectType
} from 'graphql'

import GraphQLDate from 'graphql-date'

export const PurchaseInput = new GraphQLInputObjectType({
  name: 'PurchaseInput',
  fields: {
    client_id: {
      type: new GraphQLNonNull(GraphQLID)
    },
    sub_total: {
      type: new GraphQLNonNull(GraphQLFloat)
    },
    igv: {
      type: new GraphQLNonNull(GraphQLFloat)
    },
    total: {
      type: new GraphQLNonNull(GraphQLFloat)
    },
    delivery_at: {
      type: GraphQLDate
    },
    receipt_type_id: {
      type: new GraphQLNonNull(GraphQLID)
    },
    ruc: {
      type: GraphQLString
    },
    fiscal_name: {
      type: GraphQLString
    },
    fiscal_address: {
      type: GraphQLString
    },
    dni: {
      type: GraphQLString
    },
    delivery_address: {
      type: new GraphQLNonNull(GraphQLString)
    },
    district_id: {
      type: new GraphQLNonNull(GraphQLID)
    },
    reference: {
      type: GraphQLString
    },
    payment_method_id: {
      type: new GraphQLNonNull(GraphQLID)
    }
  }
})
