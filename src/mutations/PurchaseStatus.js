import sql from '../connectors'

import _ from 'lodash'

import {
  stock
} from '../utils'

import {
  PurchaseStatusEnum
} from '../types'

import {
  GraphQLList,
  GraphQLID,
  GraphQLString,
  GraphQLNonNull
} from 'graphql'

import {
  mutationWithClientMutationId
} from 'graphql-relay'

const updatePurchaseStatus = mutationWithClientMutationId({
  name: `UpdatePurchaseStatus`,
  inputFields: {
    ids: {
      type: new GraphQLNonNull(new GraphQLList(GraphQLID))
    },
    status: {
      type: new GraphQLNonNull(GraphQLString)
    }
  },
  outputFields: {
    updated_purchase_id: {
      type: new GraphQLNonNull(new GraphQLList(GraphQLID))
    }
  },
  mutateAndGetPayload: async ({ids, status}, ctx, info) => {
    let purchases = await sql('purchase').whereIn('id', ids)

    let promises = []

    if (!PurchaseStatusEnum.getValue(status)) {
      throw new Error(`value doesn't exist`)
    }

    let value = PurchaseStatusEnum.getValue(status).value

    _.each(purchases, (purchase, key) => {
      switch (value) {
        case PurchaseStatusEnum.getValue('VALIDATED').value:
          // TODO enviar correo de aceptación de pedido
          break
        case PurchaseStatusEnum.getValue('IN_ROUTE').value:
          promises.push(stock(purchase, 'decrement'))
          // TODO enviar correo de pedido en camino
          break
        case PurchaseStatusEnum.getValue('BOUNCED').value:
          promises.push(stock(purchase, 'increment'))
          // TODO enviar correo/mensaje de rebote
          break
        case PurchaseStatusEnum.getValue('COMPLETED').value:
          // TODO enviar correo/mensaje de agradecimiento
          break
        case PurchaseStatusEnum.getValue('CANCELLED').value:
          promises.push(stock(purchase, 'increment'))
          break
      }
    })

    promises.push(
      sql('purchase').update({purchase_status_id: value}).whereIn('id', ids)
    )

    await Promise.all(promises)

    return {updated_purchase_id: ids}
  }
})

export default {updatePurchaseStatus}
