import sql from '../connectors/sql'

import Promise from 'bluebird'
import _ from 'lodash'

import {
  noop,
  generatePurchaseCode,
  paymentMethodData,
  receiptTypeData,
  moment
} from '../utils'

import {
  mutationWithClientMutationId
} from 'graphql-relay'

import {
  PurchaseInput,
  PurchaseItemInput,
  Purchase
} from '../types'

import {
  GraphQLNonNull,
  GraphQLList,
  GraphQLID
} from 'graphql'

const normalizeData = async (purchase) => {
  let district = await sql('district').where({id: purchase.district_id}).limit(1).spread(noop)

  purchase.delivery_address = `${purchase.delivery_address}, ${district.name}`

  purchase.delivery_at = moment(purchase.delivery_at).toDate()

  let paymentMethod = _.find(paymentMethodData, {id: +purchase.payment_method_id})
  let receiptType = _.find(receiptTypeData, {id: +purchase.receipt_type_id})

  delete purchase.district_id
  delete purchase.payment_method_id
  delete purchase.receipt_type_id

  purchase.payment_method = paymentMethod.meta
  purchase.receipt_type = receiptType.meta

  if (receiptType.meta === 'ticket') {
    purchase.fiscal_name = null
    purchase.fiscal_address = null
    purchase.ruc = null
  } else {
    purchase.dni = null
  }
}

const createPurchase = mutationWithClientMutationId({
  name: `CreatePurchase`,
  inputFields: {
    purchase: {
      type: new GraphQLNonNull(PurchaseInput)
    },
    items: {
      type: new GraphQLNonNull(new GraphQLList(PurchaseItemInput))
    }
  },
  outputFields: {
    created_purchase_id: {
      type: new GraphQLNonNull(GraphQLID)
    },
    purchase: {
      type: Purchase
    }
  },
  mutateAndGetPayload: async ({purchase, items}, ctx, info) => {
    await normalizeData(purchase)

    let id = await sql('purchase').insert(purchase).spread(noop)
    let code = generatePurchaseCode(id)

    let promises = [
      sql('purchase').update({code}).where({id}).limit(1)
    ]

    _.each(items, item => (item.purchase_id = id))

    promises.push(sql.batchInsert('purchase_item', items))

    await Promise.all(promises)

    purchase = await sql('purchase').where({id}).limit(1).spread(noop)

    return {created_purchase_id: id, purchase}
  }
})

const updatePurchase = mutationWithClientMutationId({
  name: `UpdatePurchase`,
  inputFields: {
    id: {
      type: new GraphQLNonNull(GraphQLID)
    },
    purchase: {
      type: new GraphQLNonNull(PurchaseInput)
    },
    items: {
      type: new GraphQLNonNull(new GraphQLList(PurchaseItemInput))
    }
  },
  outputFields: {
    updated_purchase_id: {
      type: new GraphQLNonNull(GraphQLID)
    },
    purchase: {
      type: Purchase
    }
  },
  mutateAndGetPayload: async ({id, purchase, items}, ctx, info) => {
    await normalizeData(purchase)

    await Promise.all([
      sql('purchase').update(purchase).where({id}).limit(1),
      sql('purchase_item').where({purchase_id: id}).del()
    ])

    _.each(items, item => (item.purchase_id = id))

    await sql.batchInsert('purchase_item', items)

    purchase = await sql('purchase').where({id}).limit(1).spread(noop)

    return {updated_purchase_id: id, purchase}
  }
})

const deletePurchase = mutationWithClientMutationId({
  name: `DeletePurchase`,
  inputFields: {
    ids: {
      type: new GraphQLNonNull(new GraphQLList(GraphQLID))
    }
  },
  outputFields: {
    deleted_purchase_id: {
      type: new GraphQLNonNull(new GraphQLList(GraphQLID))
    }
  },
  mutateAndGetPayload: async ({ids}, ctx, info) => {
    let promises = []

    _.each(ids, id => {
      promises.push(sql('purchase').where({id}).del())
    })

    await Promise.all(promises)

    return {deleted_purchase_id: ids}
  }
})

export default {createPurchase, updatePurchase, deletePurchase}
