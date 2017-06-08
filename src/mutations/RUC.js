import axios from 'axios'

import {
  GraphQLNonNull,
  GraphQLString,
  GraphQLFloat
} from 'graphql'

import {
  mutationWithClientMutationId
} from 'graphql-relay'

const RUC = mutationWithClientMutationId({
  name: `RUC`,
  inputFields: {
    ruc: {
      type: new GraphQLNonNull(GraphQLFloat)
    }
  },
  outputFields: {
    checked_ruc: {
      type: new GraphQLNonNull(GraphQLFloat),
      resolve: (obj) => obj.ruc
    },
    fiscal_name: {
      type: new GraphQLNonNull(GraphQLString),
      resolve: (obj) => obj.nombre_o_razon_social
    },
    address_name: {
      type: new GraphQLNonNull(GraphQLString),
      resolve: (obj) => obj.direccion
    }
  },
  mutateAndGetPayload: async ({ruc}, ctx, info) => {
    let payload = {ruc, token: process.env.RUC_TOKEN}
    let headers = {'Content-Type': 'application/json'}

    let data = await axios.post(process.env.RUC_API_URL, payload, headers)
      .then((res) => res.data.entity)

    return data
  }
})

export default RUC
