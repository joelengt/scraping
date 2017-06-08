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
  Product
} from '../types'

import {
  GraphQLNonNull,
  GraphQLID,
  GraphQLFloat,
  GraphQLList,
  GraphQLBoolean,
  GraphQLString
} from 'graphql'

// const debug = require('debug')('riqra-api:mutations:product')

const updateBusinessPartners = async (productId, businessPartnersId) => {
  await sql('business_partner_product')
  .where({product_id: productId})
  .del()

  let businessPartners = _.map(businessPartnersId, id => {
    return {
      product_id: productId,
      business_partner_id: id
    }
  })

  await sql.batchInsert('business_partner_product', businessPartners)
}

const updateCategories = async (productId, categoriesId) => {
  await sql('product_category')
  .where({product_id: productId})
  .del()

  let categories = _.map(categoriesId, id => {
    return {
      product_id: productId,
      category_id: id
    }
  })

  await sql.batchInsert('product_category', categories)
}

const createProduct = mutationWithClientMutationId({
  name: `CreateProduct`,
  inputFields: {
    brand_id: {
      type: new GraphQLNonNull(GraphQLID)
    },
    sku: {
      type: new GraphQLNonNull(GraphQLString)
    },
    name: {
      type: new GraphQLNonNull(GraphQLString)
    },
    photo: {
      type: new GraphQLNonNull(GraphQLString)
    },
    presentation: {
      type: new GraphQLNonNull(GraphQLString)
    },
    description: {
      type: new GraphQLNonNull(GraphQLString)
    },
    seo_description: {
      type: new GraphQLNonNull(GraphQLString)
    },
    time_life: {
      type: new GraphQLNonNull(GraphQLString)
    },
    offer: {
      type: GraphQLFloat
    },
    price: {
      type: new GraphQLNonNull(GraphQLFloat)
    },
    unit_price: {
      type: new GraphQLNonNull(GraphQLFloat)
    },
    suggested_price: {
      type: GraphQLFloat
    },
    categories_id: {
      type: new GraphQLList(GraphQLID)
    },
    business_partners_id: {
      type: new GraphQLList(GraphQLID)
    }
  },
  outputFields: {
    created_product_id: {
      type: new GraphQLNonNull(GraphQLID)
    },
    product: {
      type: Product
    }
  },
  mutateAndGetPayload: async (args, ctx, info) => {
    args.name_slugify = slugify(args.name)

    let categoriesId = args.categories_id
    let businessPartnersId = args.business_partners_id

    delete args.categories_id
    delete args.business_partners_id

    let id = await sql('product')
    .insert(args)
    .spread(noop)

    let product = await sql('product')
    .where({id})
    .limit(1)
    .spread(noop)

    await updateCategories(id, categoriesId)
    await updateBusinessPartners(id, businessPartnersId)

    return {created_product_id: id, product}
  }
})

const updateProduct = mutationWithClientMutationId({
  name: `UpdateProduct`,
  inputFields: {
    id: {
      type: new GraphQLNonNull(GraphQLID)
    },
    brand_id: {
      type: new GraphQLNonNull(GraphQLID)
    },
    sku: {
      type: new GraphQLNonNull(GraphQLString)
    },
    name: {
      type: new GraphQLNonNull(GraphQLString)
    },
    photo: {
      type: new GraphQLNonNull(GraphQLString)
    },
    presentation: {
      type: new GraphQLNonNull(GraphQLString)
    },
    description: {
      type: new GraphQLNonNull(GraphQLString)
    },
    seo_description: {
      type: new GraphQLNonNull(GraphQLString)
    },
    time_life: {
      type: new GraphQLNonNull(GraphQLString)
    },
    offer: {
      type: GraphQLFloat
    },
    price: {
      type: new GraphQLNonNull(GraphQLFloat)
    },
    unit_price: {
      type: new GraphQLNonNull(GraphQLFloat)
    },
    suggested_price: {
      type: GraphQLFloat
    },
    categories_id: {
      type: new GraphQLList(GraphQLID)
    },
    business_partners_id: {
      type: new GraphQLList(GraphQLID)
    }
  },
  outputFields: {
    updated_product_id: {
      type: new GraphQLNonNull(GraphQLID)
    },
    product: {
      type: Product
    }
  },
  mutateAndGetPayload: async (args, ctx, info) => {
    args.name_slugify = slugify(args.name)

    let {id} = args

    let categoriesId = args.categories_id
    let businessPartnersId = args.business_partners_id

    delete args.categories_id
    delete args.business_partners_id

    await sql('product')
    .update(args)
    .limit(1)
    .where({id})

    let product = await sql('product')
    .where({id})
    .limit(1)
    .spread(noop)

    await updateCategories(id, categoriesId)
    await updateBusinessPartners(id, businessPartnersId)

    return {updated_product_id: id, product}
  }
})

const deleteProducts = mutationWithClientMutationId({
  name: `DeleteProduct`,
  inputFields: {
    ids: {
      type: new GraphQLNonNull(new GraphQLList(GraphQLID))
    }
  },
  outputFields: {
    deleted_products_id: {
      type: new GraphQLNonNull(new GraphQLList(GraphQLID))
    }
  },
  mutateAndGetPayload: async ({ids}, ctx, info) => {
    let promises = []

    _.each(ids, id => {
      promises.push(
        sql('product')
        .where({id})
        .del()
      )
    })

    await Promise.all(promises)

    return {deleted_products_id: ids}
  }
})

const outOfStockProducts = mutationWithClientMutationId({
  name: `OutOfStockProduct`,
  inputFields: {
    ids: {
      type: new GraphQLNonNull(new GraphQLList(GraphQLID))
    }
  },
  outputFields: {
    out_of_stock_products_id: {
      type: new GraphQLNonNull(new GraphQLList(GraphQLID))
    }
  },
  mutateAndGetPayload: async ({ids}, ctx, info) => {
    await sql('product')
    .update({stock: 0})
    .whereIn('id', ids)

    return {out_of_stock_products_id: ids}
  }
})

const archiveProducts = mutationWithClientMutationId({
  name: `ArchiveProducts`,
  inputFields: {
    ids: {
      type: new GraphQLNonNull(new GraphQLList(GraphQLID))
    }
  },
  outputFields: {
    archived_products_id: {
      type: new GraphQLNonNull(new GraphQLList(GraphQLID))
    }
  },
  mutateAndGetPayload: async ({ids}, ctx, info) => {
    await sql('product')
    .update({
      is_archived: 1,
      archived_at: new Date()
    })
    .whereIn('id', ids)

    return {archived_products_id: ids}
  }
})

const unarchiveProducts = mutationWithClientMutationId({
  name: `UnarchiveProducts`,
  inputFields: {
    ids: {
      type: new GraphQLNonNull(new GraphQLList(GraphQLID))
    }
  },
  outputFields: {
    unarchived_products_id: {
      type: new GraphQLNonNull(new GraphQLList(GraphQLID))
    }
  },
  mutateAndGetPayload: async ({ids}, ctx, info) => {
    await sql('product')
    .update({
      is_archived: 0
    })
    .whereIn('id', ids)

    return {unarchived_products_id: ids}
  }
})

const alwaysInStockProducts = mutationWithClientMutationId({
  name: `AlwaysInStockProduct`,
  inputFields: {
    value: {
      type: GraphQLBoolean
    },
    ids: {
      type: new GraphQLNonNull(new GraphQLList(GraphQLID))
    }
  },
  outputFields: {
    products: {
      type: new GraphQLList(Product)
    }
  },
  mutateAndGetPayload: async ({value, ids}, ctx, info) => {
    await sql('product')
    .update({
      is_always_in_stock: value
    })
    .whereIn('id', ids)

    let products = await sql('product').whereIn('id', ids)

    return {products}
  }
})

export default {
  createProduct,
  updateProduct,
  deleteProducts,
  outOfStockProducts,
  archiveProducts,
  unarchiveProducts,
  alwaysInStockProducts
}
