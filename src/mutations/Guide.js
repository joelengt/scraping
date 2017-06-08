import sql from '../connectors'

import _ from 'lodash'
import fs from 'fs'

import {
  mutationWithClientMutationId
} from 'graphql-relay'

import {
  QBCategoryTree,
  htmlTopdf
} from '../utils'

import {
  GraphQLNonNull,
  GraphQLList,
  GraphQLID,
  GraphQLString,
  GraphQLBoolean
} from 'graphql'

import numeral from 'numeral'

const Guide = mutationWithClientMutationId({
  name: `Guide`,
  inputFields: {
    ids: {
      type: new GraphQLNonNull(new GraphQLList(GraphQLID))
    },
    onlyRiqra: {
      type: GraphQLBoolean
    }
  },
  outputFields: {
    guide_purchases_id: {
      type: new GraphQLNonNull(new GraphQLList(GraphQLID))
    },
    files: {
      type: new GraphQLNonNull(new GraphQLList(GraphQLString))
    }
  },
  mutateAndGetPayload: async(args, ctx, info) => {
    let {ids, onlyRiqra} = args

    onlyRiqra = onlyRiqra || false

    let qb = sql('purchase')
    .select([
      sql.raw('CONCAT(client.name, " ", client.last_name) as full_name'),
      'purchase.code',
      'purchase.dni',
      'purchase.ruc',
      'purchase.sub_total ',
      'purchase.igv',
      'purchase.total as total_price',
      'purchase.fiscal_name',
      'purchase.delivery_address',
      'purchase.reference',
      'pi.purchase_id',
      'pi.quantity',
      'pi.name',
      'pi.presentation',
      'pi.price',
      sql.raw('pi.quantity * pi.price as total'),
      'tree.subcategory as subcategory',
      'tree.category as category',
    ])
    .innerJoin('purchase_item as pi', qb => {
      return qb.on('pi.purchase_id', 'purchase.id')
    })
    .innerJoin('product', qb => qb.on('pi.product_id', 'product.id'))
    .innerJoin(QBCategoryTree, qb => qb.on('tree.product_id', 'product.id'))
    .innerJoin('client', qb => {
      return qb.on('client.id', 'purchase.client_id')
    })
    .whereIn('purchase.id', ids)
    .groupBy('pi.id')
    .orderBy('category')
    .orderBy('subcategory')
    .orderBy('name')
    .orderBy('presentation')

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

    let file = `${process.env.PROJECT_DIR}/templates/invoice/index.html`
    let content = fs.readFileSync(file, 'utf8')

    let promises = []

    _.each(purchases, (purchase) => {
      var total, subTotal, igv

      if (onlyRiqra) {
        var prices = _.map(purchase, (value, key) => {
          return value.price * value.quantity
        })

        total = _.sum(prices)
        subTotal = total / 1.18
        igv = total - subTotal
      } else {
        total = purchase[0].total_price
        igv = purchase[0].igv
        subTotal = purchase[0].sub_total
      }

      purchase[0]._sub_total = numeral(subTotal).format('0.00')
      purchase[0]._igv = numeral(igv).format('0.00')
      purchase[0]._total_price = numeral(total).format('0.00')

      _.each(purchase, (item) => {
        item._price = numeral(item.price).format('0.00')
        item._total = numeral(item.total).format('0.00')
      })

      promises.push(htmlTopdf(content, purchase))
    })

    let files = await Promise.all(promises)

    promises = []

    _.each(files, (file, index) => {
      promises.push(
        sql('purchase').update({guide_doc: file}).where({id: ids[index]})
      )
    })

    await Promise.all(promises)

    return {guide_purchases_id: ids, files}
  }
})

export default Guide
