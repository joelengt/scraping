import sql from '../connectors/sql'

import Promise from 'bluebird'
import _ from 'lodash'

import {
  noop
} from '../utils'

import {
  mutationWithClientMutationId
} from 'graphql-relay'

import {
  GoodsBatch
} from '../types'

import {
  GraphQLNonNull,
  GraphQLID,
  GraphQLFloat,
  GraphQLInt,
  GraphQLList
} from 'graphql'

import GraphQLDate from 'graphql-date'

const debug = require('debug')('riqra-api:mutations:goods-batch')

const createGoodsBatch = mutationWithClientMutationId({
  name: `CreateGoodsBatch`,
  inputFields: {
    product_id: {
      type: new GraphQLNonNull(GraphQLID)
    },
    price: {
      type: new GraphQLNonNull(GraphQLFloat)
    },
    quantity: {
      type: new GraphQLNonNull(GraphQLInt)
    },
    entered_at: {
      type: new GraphQLNonNull(GraphQLDate)
    },
    expires_at: {
      type: new GraphQLNonNull(GraphQLDate)
    }
  },
  outputFields: {
    created_goods_batch_id: {
      type: new GraphQLNonNull(GraphQLID)
    },
    goods_batch: {
      type: GoodsBatch
    }
  },
  mutateAndGetPayload: async (args, ctx, info) => {
    let {product_id, quantity} = args

    let [id] = await Promise.all([
      sql('goods_batch').insert(args).spread(noop),
      sql('product').where('id', product_id).increment('stock', quantity)
    ])

    let goodsBatch = await sql('goods_batch').where({id}).limit(1).spread(noop)

    return {created_goods_batch_id: id, goods_batch: goodsBatch}
  }
})

const updateGoodsBatch = mutationWithClientMutationId({
  name: `UpdateGoodsBatch`,
  inputFields: {
    id: {
      type: new GraphQLNonNull(GraphQLID)
    },
    product_id: {
      type: new GraphQLNonNull(GraphQLID)
    },
    price: {
      type: new GraphQLNonNull(GraphQLFloat)
    },
    quantity: {
      type: new GraphQLNonNull(GraphQLInt)
    },
    entered_at: {
      type: new GraphQLNonNull(GraphQLDate)
    },
    expires_at: {
      type: new GraphQLNonNull(GraphQLDate)
    }
  },
  outputFields: {
    updated_goods_batch_id: {
      type: new GraphQLNonNull(GraphQLID)
    },
    goods_batch: {
      type: GoodsBatch
    }
  },
  mutateAndGetPayload: async (args, ctx, info) => {
    debug('payload', args)

    let {id, product_id, quantity} = args

    let currentGoodsBatch = await sql('goods_batch').where({id}).limit(1).spread(noop)
    await sql('product').where('id', product_id).decrement('stock', currentGoodsBatch.quantity)

    await Promise.all([
      sql('goods_batch').update(args).limit(1).where({id}),
      sql('product').where('id', product_id).increment('stock', quantity)
    ])

    let goodsBatch = await sql('goods_batch').where({id}).limit(1).spread(noop)

    debug('goods batch in mutation', goodsBatch)

    return {updated_goods_batch_id: id, goods_batch: goodsBatch}
  }
})

const deleteGoodsBatch = mutationWithClientMutationId({
  name: `DeleteGoodsBatch`,
  inputFields: {
    ids: {
      type: new GraphQLNonNull(new GraphQLList(GraphQLID))
    }
  },
  outputFields: {
    deleted_goods_batches_id: {
      type: new GraphQLNonNull(new GraphQLList(GraphQLID))
    }
  },
  mutateAndGetPayload: async ({ids}, ctx, info) => {
    debug('ids', ids)

    let promises = []

    let goodsBatches = await sql('goods_batch').whereIn('id', ids)

    debug('goodsBatches', goodsBatches)

    _.each(ids, (id, index) => {
      let goodsBatch = goodsBatches[index]

      promises.push(
        sql('product').where('id', goodsBatch.product_id).decrement('stock', goodsBatch.quantity)
      )

      promises.push(sql('goods_batch').where({id}).del())
    })

    await Promise.all(promises)

    return {deleted_goods_batches_id: ids}
  }
})

export default {createGoodsBatch, updateGoodsBatch, deleteGoodsBatch}
