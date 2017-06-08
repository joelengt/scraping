import sql from '../connectors'

import {
  numeral,
  moment,
  noop,
  paymentMethodData,
  receiptTypeData
} from '../utils'

import _ from 'lodash'

import {
  globalIdField
} from 'graphql-relay'

import {NodeInterface} from './Node'
import {User} from './User'
import {District} from './District'
import {PurchaseStatus} from './PurchaseStatus'
import {PurchaseItem} from './PurchaseItem'
import {PaymentMethod} from './PaymentMethod'
import {ReceiptType} from './ReceiptType'
import {Address} from './Address'

import {
  GraphQLObjectType,
  GraphQLFloat,
  GraphQLString,
  GraphQLList,
  GraphQLID,
  GraphQLBoolean
} from 'graphql'

import GraphQLDate from 'graphql-date'

export const Purchase = new GraphQLObjectType({
  name: 'Purchase',
  interfaces: [NodeInterface],
  fields: () => ({
    id: globalIdField(),
    _id: {
      type: GraphQLID,
      resolve: obj => obj.id
    },
    user: {
      type: User,
      resolve (obj, args, {loaders}, info) {
        return loaders.users.load(obj.client_id)
      }
    },
    status: {
      type: PurchaseStatus,
      resolve (obj, args, {loaders}, info) {
        return loaders.purchaseStatus.load(obj.id)
      }
    },
    code: {
      type: GraphQLString
    },
    sub_total: {
      type: GraphQLFloat
    },
    igv: {
      type: GraphQLFloat
    },
    total: {
      type: GraphQLFloat
    },
    payment_cost: {
      type: GraphQLFloat
    },
    shipping_cost: {
      type: GraphQLFloat
    },
    _sub_total: {
      type: GraphQLString,
      resolve: obj => numeral(obj.sub_total).format()
    },
    _igv: {
      type: GraphQLString,
      resolve: obj => numeral(obj.igv).format()
    },
    _total: {
      type: GraphQLString,
      resolve: obj => numeral(obj.total).format()
    },
    _payment_cost: {
      type: GraphQLString,
      resolve: obj => numeral(obj.payment_cost).format()
    },
    _shipping_cost: {
      type: GraphQLString,
      resolve: obj => numeral(obj.shipping_cost).format()
    },
    receipt: {
      type: ReceiptType,
      resolve: (obj) => _.find(receiptTypeData, {meta: obj.receipt_type})
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
      type: GraphQLString,
      resolve: (obj) => {
        let districtParts = obj.delivery_address.split(',')

        districtParts = _.slice(districtParts, 0, districtParts.length - 1)

        return districtParts.join('')
      }
    },
    reference: {
      type: GraphQLString
    },
    created_at: {
      type: GraphQLDate
    },
    delivery_at: {
      type: GraphQLDate
    },
    _created_at: {
      type: GraphQLString,
      resolve: obj => moment(obj.created_at).format('LLL')
    },
    _delivery_at: {
      type: GraphQLString,
      resolve: obj => moment(obj.delivery_at).format('LLL')
    },
    district: {
      type: District,
      resolve: obj => {
        let districtParts = obj.delivery_address.split(',')
        let district = _.trim(districtParts[districtParts.length - 1])

        return sql('district').where({name: district}).limit(1).spread(noop)
      }
    },
    payment: {
      type: PaymentMethod,
      resolve: (obj) => _.find(paymentMethodData, {meta: obj.payment_method})
    },
    items: {
      type: new GraphQLList(PurchaseItem),
      resolve (obj, args, {loaders}, info) {
        return loaders.purchaseItem.load(obj.id)
      }
    },
    bill_doc: {
      type: GraphQLString,
      resolve: (obj) => {
        return 'av one place'
      }
    },
    bill_address: {
      type: GraphQLString,
      resolve: (obj) => {
        return 'av second place'
      }
    },
    guide_doc: {
      type: GraphQLString
    }
  })
})
