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
  Banner
} from '../types'

import {
  GraphQLNonNull,
  GraphQLID,
  GraphQLList,
  GraphQLString
} from 'graphql'

// const debug = require('debug')('riqra-api:mutations:banner')

const createBanner = mutationWithClientMutationId({
  name: `CreateBanner`,
  inputFields: {
    name: {
      type: new GraphQLNonNull(GraphQLString)
    },
    photo: {
      type: new GraphQLNonNull(GraphQLString)
    },
    link: {
      type: new GraphQLNonNull(GraphQLString)
    }
  },
  outputFields: {
    created_banner_id: {
      type: new GraphQLNonNull(GraphQLID)
    },
    banner: {
      type: Banner
    }
  },
  mutateAndGetPayload: async (args, ctx, info) => {
    let id = await sql('banner')
    .insert(args)
    .spread(noop)

    let banner = await sql('banner')
    .where({id})
    .limit(1)
    .spread(noop)

    return {created_banner_id: id, banner}
  }
})

const updateBanner = mutationWithClientMutationId({
  name: `UpdateBanner`,
  inputFields: {
    id: {
      type: new GraphQLNonNull(GraphQLID)
    },
    name: {
      type: new GraphQLNonNull(GraphQLString)
    },
    photo: {
      type: new GraphQLNonNull(GraphQLString)
    },
    link: {
      type: new GraphQLNonNull(GraphQLString)
    }
  },
  outputFields: {
    updated_banner_id: {
      type: new GraphQLNonNull(GraphQLID)
    },
    banner: {
      type: Banner
    }
  },
  mutateAndGetPayload: async (args, ctx, info) => {
    let {id} = args

    await sql('banner')
    .update(args)
    .limit(1)
    .where({id})

    let banner = await sql('banner')
    .where({id})
    .limit(1)
    .spread(noop)

    return {updated_banner_id: id, banner}
  }
})

const deleteBanners = mutationWithClientMutationId({
  name: `DeleteBanner`,
  inputFields: {
    ids: {
      type: new GraphQLNonNull(new GraphQLList(GraphQLID))
    }
  },
  outputFields: {
    deleted_banners_id: {
      type: new GraphQLNonNull(new GraphQLList(GraphQLID))
    }
  },
  mutateAndGetPayload: async ({ids}, ctx, info) => {
    let promises = []

    _.each(ids, id => {
      promises.push(
        sql('banner')
        .where({id})
        .del()
      )
    })

    await Promise.all(promises)

    return {deleted_banners_id: ids}
  }
})

export default {createBanner, updateBanner, deleteBanners}
