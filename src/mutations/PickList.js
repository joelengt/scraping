import sql from '../connectors'

import {
  QBCategoryTree,
  uploadToS3
} from '../utils'

import {
  mutationWithClientMutationId
} from 'graphql-relay'

import {
  GraphQLNonNull,
  GraphQLList,
  GraphQLID,
  GraphQLString,
  GraphQLBoolean
} from 'graphql'

import json2csv from 'json2csv'

// const debug = require('debug')('riqra-api:mutations:picklist')

const PickList = mutationWithClientMutationId({
  name: `PickList`,
  inputFields: {
    ids: {
      type: new GraphQLNonNull(new GraphQLList(GraphQLID))
    },
    onlyRiqra: {
      type: GraphQLBoolean
    }
  },
  outputFields: {
    picklist_purchases_id: {
      type: new GraphQLNonNull(new GraphQLList(GraphQLID))
    },
    file: {
      type: new GraphQLNonNull(GraphQLString)
    }
  },
  mutateAndGetPayload: async({ids, onlyRiqra}, ctx, info) => {
    onlyRiqra = onlyRiqra || false

    let qb = sql('purchase')
    .select([
      sql.raw('SUM(pi.quantity) as quantity'),
      'pi.name as name',
      'pi.presentation as presentation',
      'pi.product_id as product_id',
      'brand.name as brand_name',
      'tree.subcategory as subcategory',
      'tree.category as category'
    ])
    .innerJoin('purchase_item as pi', qb => qb.on('pi.purchase_id', 'purchase.id'))
    .innerJoin('product', qb => qb.on('pi.product_id', 'product.id'))
    .innerJoin('brand', qb => qb.on('brand.id', 'product.brand_id'))
    .innerJoin(QBCategoryTree, qb => qb.on('tree.product_id', 'product.id'))
    .whereIn('purchase.id', ids)
    .groupBy('pi.product_id')
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

    let picklist = await qb

    let fields = ['quantity', 'name', 'presentation', 'product_id', 'brand_name', 'subcategory', 'category']

    let fieldNames = ['CANTIDAD', 'PRODUCTO', 'DETALLE', 'ID', 'MARCA', 'SUBCATEGORIA', 'CATEGORIA']

    let buffer = json2csv({data: picklist, fields, fieldNames})
    let filename = `picklist-${ids.join('-')}.csv`
    let file = await uploadToS3(process.env.S3_BUCKET, filename, buffer)

    return {picklist_purchases_id: ids, file}
  }
})

export default PickList
