import sql from '../connectors'

import _ from 'lodash'

import {
  moment,
  uploadToS3,
  paymentMethodData
} from '../utils'

import {
  mutationWithClientMutationId
} from 'graphql-relay'

import {
  GraphQLList,
  GraphQLNonNull,
  GraphQLString,
  GraphQLID
} from 'graphql'

import json2csv from 'json2csv'

// const debug = require('debug')('riqra-api:mutations:export')

const Export = mutationWithClientMutationId({
  name: `Export`,
  inputFields: {
    ids: {
      type: new GraphQLNonNull(new GraphQLList(GraphQLID))
    }
  },
  outputFields: {
    exported_entity_ids: {
      type: new GraphQLNonNull(new GraphQLList(GraphQLID))
    },
    file: {
      type: new GraphQLNonNull(GraphQLString)
    }
  },
  mutateAndGetPayload: async({ids}, ctx, info) => {
    let purchases = await sql('purchase')
    .select([
      sql.raw('CONCAT(client.name, " ", client.last_name) as client_name'),
      'client.phone as client_phone',
      'purchase.delivery_address',
      'purchase.created_at',
      'purchase.delivery_at',
      'purchase.code',
      'purchase.total',
      'purchase.payment_method',
      'purchase.num_doc',
      sql.raw('CONCAT(IF(purchase.dni IS NOT NULL, "B", "F"), "001")  AS serie'),
      sql.raw('IF(purchase.dni IS NOT NULL, purchase.dni, purchase.ruc) AS bill_num'),
      sql.raw('IF(purchase.dni IS NOT NULL, CONCAT(client.name, " ", client.last_name), purchase.fiscal_name) AS entity')
    ])
    .innerJoin('client', qb => {
      return qb.on('client.id', 'purchase.client_id')
    })
    .whereIn('purchase.id', ids)

    let fields = [
      'flag', 'code', 'client', 'address', 'district', 'phone', 'order', 'delivery_hour',
      'obs', 'payment', 'created_at', 'delivery_at', 'days', 'route', 'attention', 'total',
      'bill_num', 'entity', 'cpe'
    ]

    let fieldNames = [
      'FLAG', 'PEDIDO', 'CLIENTE', 'DIRECCION', 'DISTRITO', 'TELEFONO', 'ORDEN', 'HORA_ENTREGA',
      'OBSERVACIONES', 'METODO DE PAGO', 'FECHA_PEDIDO', 'FECHA_ENTREGA', 'DIAS', 'RUTA', 'ATENCION', 'TOTAL',
      'DOCUMENTO', 'ENTIDAD', 'CPE'
    ]

    let data = _.map(purchases, item => {
      let addressParts = item.delivery_address.split(',')
      let district = _.trim(addressParts[addressParts.length - 1])
      let paymentMethod = _.find(paymentMethodData, {meta: item.payment_method})
      let client = _.startCase(_.toLower(item.client_name))
      let createdAt = moment(item.created_at).format('DD-MM-YYYY')
      let deliveryAt = moment(item.delivery_at).format('DD-MM-YYYY')

      let itemData = {
        flag: '',
        code: item.code,
        client,
        address: item.delivery_address,
        district,
        phone: item.client_phone,
        order: '',
        delivery_hour: '',
        obs: '',
        payment: paymentMethod.name,
        created_at: createdAt,
        delivery_at: deliveryAt,
        days: '',
        route: '',
        attention: '',
        total: item.total,
        bill_num: item.bill_num,
        entity: item.entity
      }

      if (item.num_doc) {
        itemData.cpe = `${item.serie}-${item.num_doc}`
      } else {
        itemData.cpe = ''
      }

      return itemData
    })

    let buffer = json2csv({data, fields, fieldNames})
    let filename = `export-${ids.join('-')}.csv`
    let file = await uploadToS3(process.env.S3_BUCKET, filename, buffer)

    return {exported_entity_ids: ids, file}
  }
})

export default Export
