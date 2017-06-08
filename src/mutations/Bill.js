import sql from '../connectors/sql'

import axios from 'axios'
import moment from 'moment'
import Promise from 'bluebird'
import _ from 'lodash'

import {
  noop
} from '../utils'

import {
  mutationWithClientMutationId
} from 'graphql-relay'

import {
  GraphQLList,
  GraphQLNonNull,
  GraphQLID,
  GraphQLBoolean
} from 'graphql'

import GraphQLJSON from 'graphql-type-json'

const debug = require('debug')('riqra-api:mutations:bill')

const nubefact = axios.create({
  headers: {
    'Authorization': process.env.NUBEFACT_API_TOKEN,
    'Content-Type': 'application/json'
  }
})

const Bill = mutationWithClientMutationId({
  name: `Bill`,
  inputFields: {
    ids: {
      type: new GraphQLNonNull(new GraphQLList(GraphQLID))
    },
    onlyRiqra: {
      type: GraphQLBoolean
    },
    creditNote: {
      type: GraphQLBoolean
    }
  },
  outputFields: {
    billed_purchases_id: {
      type: new GraphQLNonNull(new GraphQLList(GraphQLID))
    },
    files: {
      type: new GraphQLNonNull(new GraphQLList(GraphQLJSON))
    }
  },
  mutateAndGetPayload: async({ids, creditNote, onlyRiqra}, ctx, info) => {
    onlyRiqra = onlyRiqra || false

    let qb = sql('purchase')
    .select([
      'purchase.id',
      'purchase.code',
      'purchase.sub_total',
      'purchase.igv as igv',
      'purchase.total',
      'purchase.receipt_type',
      'purchase.num_doc',
      'purchase.bill_doc',
      'purchase.payment_cost',
      'pi.purchase_id',
      'pi.quantity',
      'pi.name',
      'pi.presentation',
      'pi.price',
      sql.raw('IF(purchase.dni IS NOT NULL, "2", "1") AS bill_type'),
      sql.raw('CONCAT(IF(purchase.dni IS NOT NULL, "B", "F"), "001")  AS bill_serie'),
      sql.raw('IF(purchase.dni IS NOT NULL, purchase.dni, purchase.ruc) AS bill_num'),
      sql.raw('IF(purchase.dni IS NOT NULL, "1", "6") AS bill_doc_type'),
      sql.raw('IF(purchase.dni IS NOT NULL, CONCAT(client.name, " ", client.last_name), purchase.fiscal_name) AS bill_entity'),
      sql.raw('IF(purchase.dni IS NOT NULL, purchase.delivery_address, purchase.fiscal_address) AS bill_address'),
      'client.email as email'
    ])
    .innerJoin('client', qb => qb.on('client.id', 'purchase.client_id'))
    .innerJoin('purchase_item as pi', qb => {
      return qb.on('pi.purchase_id', 'purchase.id')
    })
    .innerJoin('product', qb => qb.on('pi.product_id', 'product.id'))
    .whereIn('purchase.id', ids)

    if (onlyRiqra) {
      qb.innerJoin('business_partner_product as bpp', qb => {
        return qb.on('bpp.product_id', 'product.id')
      })
      .innerJoin('business_partner', qb => {
        return qb.on('business_partner.id', 'bpp.business_partner_id')
      })
      .where('business_partner.is_riqra', 1)
    }

    let purchases = await qb
    .then(data => _.values(_.groupBy(data, 'purchase_id')))

    let files = []

    await new Promise((resolve, reject) => {
      const walker = async (index) => {
        debug(`walker init with index  ${index}`)

        if (index === purchases.length) {
          return resolve()
        }

        let purchase = purchases[index][0]

        let uniqueCodeName = `${purchase.receipt_type}_number`

        debug(`bill_doc : ${purchase.bill_doc}`)

        if (purchase.bill_doc) {
          if (!creditNote) {
            files.push({purchase: purchase.id, file: purchase.bill_doc})
            return walker(++index)
          }
          uniqueCodeName = `credit_note_${uniqueCodeName}`
        } else {
          if (creditNote) {
            files.push({purchase: purchase.id, file: null})
            return walker(++index)
          }
        }

        await sql('sunat').increment(uniqueCodeName, 1)

        let sunat = await sql('sunat').limit(1).spread(noop)
        let uniqueCodeValue = sunat[uniqueCodeName]

        debug(`unique code name ${uniqueCodeName}`)
        debug(`unique code value ${uniqueCodeValue}`)

        let currentType = (creditNote ? '3' : purchase.bill_type)

        debug(`current type ${currentType}`)

        if (onlyRiqra) {
          var prices = _.map(purchases[index], (value, key) => {
            return value.price * value.quantity
          })

          purchase.total = Number(_.sum(prices)).toFixed(2)
          purchase.sub_total = Number(purchase.total / 1.18).toFixed(2)
          purchase.igv = Number(purchase.total - purchase.sub_total).toFixed(2)
        }

        let payload = {
          type: 'send_invoice',
          invoice: {
            tipo: currentType,
            serie: purchase.bill_serie,
            numero: uniqueCodeValue,
            entidad_numero_de_documento: purchase.bill_num,
            entidad_tipo_de_documento: purchase.bill_doc_type,
            entidad_denominacion: purchase.bill_entity.toUpperCase(),
            entidad_direccion: purchase.bill_address.toUpperCase(),
            entidad_email: purchase.email.toUpperCase(),
            fecha_de_emision: moment().format('DD-MM-YYYY'),
            fecha_de_vencimiento: '',
            moneda: '1',
            tipo_de_cambio: '',
            operacion_gratuita: 'false',
            total_gravada: purchase.sub_total,
            total_inafecta: '',
            total_exonerada: '',
            total_igv: purchase.igv,
            total_gratuita: '',
            descuento_global: '',
            total_otros_cargos: '',
            total: purchase.total,
            detraccion: 'false',
            observaciones: '',
            documento_que_se_modifica_tipo: (creditNote ? purchase.bill_type : ''),
            documento_que_se_modifica_serie: (creditNote ? purchase.bill_serie : ''),
            documento_que_se_modifica_numero: (creditNote ? purchase.num_doc : ''),
            tipo_de_nota_de_credito: (creditNote ? '1' : ''),
            tipo_de_nota_de_debito: '',
            enviar_automaticamente_a_la_sunat: 'true',
            enviar_automaticamente_al_cliente: 'true ',
            cancelado: 'true',
            codigo_unico: `${currentType}-${purchase.bill_serie}-${uniqueCodeValue}`,
            invoice_lines: []
          }
        }

        if (purchase.payment_cost) {
          let paymentCostTotal = purchase.payment_cost
          let paymentCostSubTotal = paymentCostTotal / 1.18
          let paymentCostIGV = paymentCostTotal - paymentCostSubTotal

          let newProductsTotal = purchase.total - purchase.payment_cost
          let newProductsSubTotal = newProductsTotal / 1.18
          let newProductsIGV = newProductsTotal - newProductsSubTotal

          payload.invoice.invoice_lines.push({
            unit_code: 'ZZ',
            cantidad: '1',
            tipo_de_igv: '1',
            valor_unitario: newProductsSubTotal,
            precio_unitario: newProductsTotal,
            subtotal: newProductsSubTotal,
            igv: newProductsIGV,
            total: newProductsTotal,
            descripcion: 'COMPRA EN RIQRA.COM'
          })

          payload.invoice.invoice_lines.push({
            unit_code: 'ZZ',
            cantidad: '1',
            tipo_de_igv: '1',
            valor_unitario: paymentCostSubTotal,
            precio_unitario: paymentCostTotal,
            subtotal: paymentCostSubTotal,
            igv: paymentCostIGV,
            total: paymentCostTotal,
            descripcion: 'RECARGO POR PAGO CON TARJETA'
          })
        } else {
          payload.invoice.invoice_lines.push({
            unit_code: 'ZZ',
            cantidad: '1',
            tipo_de_igv: '1',
            valor_unitario: purchase.sub_total,
            precio_unitario: purchase.total,
            subtotal: purchase.sub_total,
            igv: purchase.igv,
            total: purchase.total,
            descripcion: 'COMPRA EN RIQRA.COM'
          })
        }

        nubefact.post(process.env.NUBEFACT_API_URL, payload)
        .then(res => {
          let {key} = res.data.invoice
          let file = `${process.env.NUBEFACT_API_BILL}${key}.pdf`

          files.push({
            purchase: purchase.id,
            file
          })

          sql('purchase').update({
            is_doc_riqra: onlyRiqra,
            bill_doc: (creditNote ? null : file),
            num_doc: (creditNote ? null : uniqueCodeValue),
            purchase_status_id: (creditNote ? 2 : 7)
          }).where({id: purchase.id})
          .then(() => {
            walker(++index)
          })
        })
        .catch(e => {
          debug(purchase.id, e)
          sql('sunat').decrement(uniqueCodeName)
          .then(() => {
            files.push({
              purchase: purchase.id,
              file: null
            })
            walker(++index)
          })
        })
      }

      walker(0)
    })

    return {billed_purchases_id: ids, files}
  }
})

export default Bill
