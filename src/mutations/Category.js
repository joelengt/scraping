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
  Category
} from '../types'

import {
  GraphQLNonNull,
  GraphQLID,
  GraphQLList,
  GraphQLString,
  GraphQLInt
} from 'graphql'

// const debug = require('debug')('riqra-api:mutations:category')

const createCategory = mutationWithClientMutationId({
  name: `CreateCategory`,
  inputFields: {
    name: {
      type: new GraphQLNonNull(GraphQLString)
    },
    photo: {
      type: new GraphQLNonNull(GraphQLString)
    },
    description: {
      type: new GraphQLNonNull(GraphQLString)
    },
    level: {
      type: new GraphQLNonNull(GraphQLInt)
    }
  },
  outputFields: {
    created_category_id: {
      type: new GraphQLNonNull(GraphQLID)
    },
    category: {
      type: Category
    }
  },
  mutateAndGetPayload: async (args, ctx, info) => {
    args.name_slugify = slugify(args.name)

    let id = await sql('category')
    .insert(args)
    .spread(noop)

    let category = await sql('category')
    .where({id})
    .limit(1)
    .spread(noop)

    return {created_category_id: id, category}
  }
})

const updateCategory = mutationWithClientMutationId({
  name: `UpdateCategory`,
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
    description: {
      type: new GraphQLNonNull(GraphQLString)
    },
    level: {
      type: new GraphQLNonNull(GraphQLInt)
    }
  },
  outputFields: {
    updated_category_id: {
      type: new GraphQLNonNull(GraphQLID)
    },
    category: {
      type: Category
    }
  },
  mutateAndGetPayload: async (args, ctx, info) => {
    args.name_slugify = slugify(args.name)

    let {id} = args

    await sql('category')
    .update(args)
    .limit(1)
    .where({id})

    let category = await sql('category')
    .where({id})
    .limit(1)
    .spread(noop)

    return {updated_category_id: id, category}
  }
})

const deleteCategories = mutationWithClientMutationId({
  name: `DeleteCategory`,
  inputFields: {
    ids: {
      type: new GraphQLNonNull(new GraphQLList(GraphQLID))
    }
  },
  outputFields: {
    deleted_categories_id: {
      type: new GraphQLNonNull(new GraphQLList(GraphQLID))
    }
  },
  mutateAndGetPayload: async ({ids}, ctx, info) => {
    let promises = []

    _.each(ids, id => {
      promises.push(
        sql('category')
        .where({id})
        .del()
      )
    })

    await Promise.all(promises)

    return {deleted_categories_id: ids}
  }
})

const archiveCategories = mutationWithClientMutationId({
  name: `ArchiveCategory`,
  inputFields: {
    ids: {
      type: new GraphQLNonNull(new GraphQLList(GraphQLID))
    }
  },
  outputFields: {
    archived_categories_id: {
      type: new GraphQLNonNull(new GraphQLList(GraphQLID))
    }
  },
  mutateAndGetPayload: async ({ids}, ctx, info) => {
    await sql('category')
    .update({
      is_archived: 1,
      archived_at: new Date()
    })
    .whereIn('id', ids)

    return {archived_categories_id: ids}
  }
})

const updateSubCategories = mutationWithClientMutationId({
  name: `UpdateSubCategory`,
  inputFields: {
    id: {
      type: new GraphQLNonNull(GraphQLID)
    },
    subcategories_id: {
      type: new GraphQLNonNull(new GraphQLList(GraphQLID))
    }
  },
  outputFields: {
    updated_subcategories_id: {
      type: new GraphQLNonNull(new GraphQLList(GraphQLID))
    }
  },
  mutateAndGetPayload: async (args, ctx, info) => {
    await sql('category_relation').where({parent_id: args.id}).del()

    let items = []

    _.each(args.subcategories_id, id => {
      items.push({parent_id: args.id, child_id: id})
    })

    await sql.batchInsert('category_relation', items)

    return {updated_subcategories_id: args.subcategories_id}
  }
})

export default {
  createCategory,
  updateCategory,
  deleteCategories,
  archiveCategories,
  updateSubCategories
}
