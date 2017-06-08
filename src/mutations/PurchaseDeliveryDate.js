import sql from '../connectors'

import moment from 'moment'

import {
  GraphQLList,
  GraphQLID,
  GraphQLNonNull
} from 'graphql'

import GraphQLDate from 'graphql-date'

import {
  mutationWithClientMutationId
} from 'graphql-relay'

const updatePurchaseDeliveryDate = mutationWithClientMutationId({
  name: `UpdatePurchaseDeliveryDate`,
  inputFields: {
    ids: {
      type: new GraphQLNonNull(new GraphQLList(GraphQLID))
    },
    delivery_at: {
      type: new GraphQLNonNull(GraphQLDate)
    }
  },
  outputFields: {
    updated_purchase_id: {
      type: new GraphQLNonNull(new GraphQLList(GraphQLID))
    }
  },
  mutateAndGetPayload: async ({ids, delivery_at}, ctx, info) => {
    let deliveryAt = moment(delivery_at).toDate()

    await sql('purchase').update({delivery_at: deliveryAt}).whereIn('id', ids)

    return {updated_purchase_id: ids}
  }
})

export default {updatePurchaseDeliveryDate}
