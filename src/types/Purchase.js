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
    subTotal: {
      type: GraphQLFloat
    },
    igv: {
      type: GraphQLFloat
    },
    total: {
      type: GraphQLFloat
    },
    paymentCost: {
      type: GraphQLFloat
    },
    shippingCost: {
      type: GraphQLFloat
    },
    _subTotal: {
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
    _paymentCost: {
      type: GraphQLString,
      resolve: obj => numeral(obj.payment_cost).format()
    },
    _shippingCost: {
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
    fiscalAddress: {
      type: GraphQLString
    },
    dni: {
      type: GraphQLString
    },
    deliveryAddress: {
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
    createdAt: {
      type: GraphQLDate
    },
    deliveryAt: {
      type: GraphQLDate
    },
    _createdAt: {
      type: GraphQLString,
      resolve: obj => moment(obj.created_at).format('LLL')
    },
    _deliveryAt: {
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
    billDoc: {
      type: GraphQLString,
      resolve: (obj) => {
        return 'av one place'
      }
    },
    billAddress: {
      type: GraphQLString,
      resolve: (obj) => {
        return 'av second place'
      }
    },
    guideDoc: {
      type: GraphQLString
    }
  })
})
