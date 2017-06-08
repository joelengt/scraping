import sql from '../connectors/sql'

import Promise from 'bluebird'
import _ from 'lodash'

import {
  noop,
  slugify
} from '../utils'

import {
  mutationWithClientMutationId
} from 'graphql-relay'

import {
  Brand
} from '../types'

import {
  GraphQLNonNull,
  GraphQLID,
  GraphQLList,
  GraphQLString
} from 'graphql'

// const debug = require('debug')('riqra-api:mutations:brand')

const createBrand = mutationWithClientMutationId({
  name: `CreateBrand`,
  inputFields: {
    company_id: {
      type: new GraphQLNonNull(GraphQLID)
    },
    name: {
      type: new GraphQLNonNull(GraphQLString)
    },
    photo: {
      type: new GraphQLNonNull(GraphQLString)
    },
    description: {
      type: new GraphQLNonNull(GraphQLString)
    },
    seo_description: {
      type: new GraphQLNonNull(GraphQLString)
    }
  },
  outputFields: {
    created_brand_id: {
      type: new GraphQLNonNull(GraphQLID)
    },
    brand: {
      type: Brand
    }
  },
  mutateAndGetPayload: async (args, ctx, info) => {
    args.name_slugify = slugify(args.name)

    let id = await sql('brand')
    .insert(args)
    .spread(noop)

    let brand = await sql('brand')
    .where({id})
    .limit(1)
    .spread(noop)

    return {created_brand_id: id, brand}
  }
})

const updateBrand = mutationWithClientMutationId({
  name: `UpdateBrand`,
  inputFields: {
    id: {
      type: new GraphQLNonNull(GraphQLID)
    },
    company_id: {
      type: new GraphQLNonNull(GraphQLID)
    },
    name: {
      type: new GraphQLNonNull(GraphQLString)
    },
    photo: {
      type: new GraphQLNonNull(GraphQLString)
    },
    description: {
      type: new GraphQLNonNull(GraphQLString)
    },
    seo_description: {
      type: new GraphQLNonNull(GraphQLString)
    }
  },
  outputFields: {
    updated_brand_id: {
      type: new GraphQLNonNull(GraphQLID)
    },
    brand: {
      type: Brand
    }
  },
  mutateAndGetPayload: async (args, ctx, info) => {
    args.name_slugify = slugify(args.name)

    let {id} = args

    await sql('brand')
    .update(args)
    .limit(1)
    .where({id})

    let brand = await sql('brand')
    .where({id})
    .limit(1)
    .spread(noop)

    return {updated_brand_id: id, brand}
  }
})

const deleteBrands = mutationWithClientMutationId({
  name: `DeleteBrand`,
  inputFields: {
    ids: {
      type: new GraphQLNonNull(new GraphQLList(GraphQLID))
    }
  },
  outputFields: {
    deleted_brands_id: {
      type: new GraphQLNonNull(new GraphQLList(GraphQLID))
    }
  },
  mutateAndGetPayload: async ({ids}, ctx, info) => {
    let promises = []

    _.each(ids, id => {
      promises.push(
        sql('brand')
        .where({id})
        .del()
      )
    })

    await Promise.all(promises)

    return {deleted_brands_id: ids}
  }
})

const archiveBrands = mutationWithClientMutationId({
  name: `ArchiveBrand`,
  inputFields: {
    ids: {
      type: new GraphQLNonNull(new GraphQLList(GraphQLID))
    }
  },
  outputFields: {
    archived_brands_id: {
      type: new GraphQLNonNull(new GraphQLList(GraphQLID))
    }
  },
  mutateAndGetPayload: async ({ids}, ctx, info) => {
    await sql('brand')
    .update({
      is_archived: 1,
      archived_at: new Date()
    })
    .whereIn('id', ids)

    return {archived_brands_id: ids}
  }
})

export default {createBrand, updateBrand, deleteBrands, archiveBrands}
