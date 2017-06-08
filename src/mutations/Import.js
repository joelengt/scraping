import sql from '../connectors'

import axios from 'axios'
import _ from 'lodash'

import {
  csvTojson,
  moment,
  slugify
} from '../utils'

import {
  mutationWithClientMutationId
} from 'graphql-relay'

import {
  GraphQLNonNull,
  GraphQLString,
  GraphQLBoolean
} from 'graphql'

import {
  EntityEnum
} from '../types'

import Promise from 'bluebird'

/**
 * we can't get registers ids in a batch transaction
 * https://github.com/tgriesser/knex/issues/1828
 **/

// const debug = require('debug')('riqra-api:mutations:import')

const Import = mutationWithClientMutationId({
  name: `Import`,
  inputFields: {
    file: {
      type: new GraphQLNonNull(GraphQLString)
    },
    type: {
      type: new GraphQLNonNull(EntityEnum)
    }
  },
  outputFields: {
    imported: {
      type: new GraphQLNonNull(GraphQLBoolean)
    }
  },
  mutateAndGetPayload: async({file, type}, ctx, info) => {
    let csv = await axios.get(file).then(result => result.data)

    let items = await csvTojson(csv)

    let promises = []

    if (type === 'goods_batch') {
      _.each(items, (value, key) => {
        value.expires_at = moment(value.expires_at, 'DD-MM-YYYY').toDate()
        value.entered_at = moment(value.entered_at, 'DD-MM-YYYY').toDate()

        let qb = sql('product')
        .where('id', value.product_id)
        .increment('stock', value.quantity)

        promises.push(qb)
      })

      await Promise.all(promises)

      promises = [
        sql.batchInsert('goods_batch', items)
      ]
    } else if (type === 'products') {
      let productIds = _.map(items, 'id')

      let productDbIds = await sql('product')
      .whereIn('id', productIds)

      let itemsToCreate = _.differenceBy(items, productDbIds, 'id')
      let itemsToUpdate = _.intersectionBy(items, productDbIds, 'id')

      _.each(itemsToCreate, (item) => {
        item.name_slugify = slugify(item.name)
      })

      promises = [
        sql.batchInsert('product', itemsToCreate)
      ]

      _.each(itemsToUpdate, (value, key) => {
        let qb = sql('product')
        .update(value)
        .where('id', value.id)

        promises.push(qb)
      })
    }

    await Promise.all(promises)

    return {imported: true}
  }
})

export default Import
