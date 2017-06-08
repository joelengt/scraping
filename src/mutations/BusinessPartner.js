import sql from '../connectors/sql'

import {
  noop,
  slugify
} from '../utils'

import {
  mutationWithClientMutationId
} from 'graphql-relay'

import {
  GraphQLNonNull,
  GraphQLID,
  GraphQLFloat,
  GraphQLBoolean,
  GraphQLString,
  GraphQLList
} from 'graphql'

import {
  BusinessPartner
} from '../types'

import _ from 'lodash'

const createBusinessPartner = mutationWithClientMutationId({
  name: `CreateBusinessPartner`,
  inputFields: {
    name: {
      type: new GraphQLNonNull(GraphQLString)
    },
    logo: {
      type: new GraphQLNonNull(GraphQLString)
    },
    color: {
      type: new GraphQLNonNull(GraphQLString)
    },
    minimun_purchase: {
      type: new GraphQLNonNull(GraphQLFloat)
    },
    delivery_message: {
      type: new GraphQLNonNull(GraphQLString)
    },
    is_featured: {
      type: GraphQLBoolean
    }
  },
  outputFields: {
    created_business_partner_id: {
      type: new GraphQLNonNull(GraphQLID)
    },
    business_partner: {
      type: BusinessPartner
    }
  },
  mutateAndGetPayload: async (args, ctx, info) => {
    args.name_slugify = slugify(args.name)

    let id = await sql('business_partner')
    .insert(args)
    .spread(noop)

    let businessPartner = await sql('business_partner')
    .where({id})
    .limit(1)
    .spread(noop)

    return {created_business_partner_id: id, business_partner: businessPartner}
  }
})

const updateBusinessPartner = mutationWithClientMutationId({
  name: `UpdateBusinessPartner`,
  inputFields: {
    id: {
      type: new GraphQLNonNull(GraphQLID)
    },
    name: {
      type: new GraphQLNonNull(GraphQLString)
    },
    logo: {
      type: new GraphQLNonNull(GraphQLString)
    },
    color: {
      type: new GraphQLNonNull(GraphQLString)
    },
    minimun_purchase: {
      type: new GraphQLNonNull(GraphQLFloat)
    },
    delivery_message: {
      type: new GraphQLNonNull(GraphQLString)
    },
    is_featured: {
      type: GraphQLBoolean
    }
  },
  outputFields: {
    updated_business_partner_id: {
      type: new GraphQLNonNull(GraphQLID)
    },
    business_partner: {
      type: BusinessPartner
    }
  },
  mutateAndGetPayload: async (args, ctx, info) => {
    args.name_slugify = slugify(args.name)

    let {id} = args

    await sql('business_partner')
    .update(args)
    .limit(1)
    .where({id})

    let businessPartner = await sql('business_partner')
    .where({id})
    .limit(1)
    .spread(noop)

    return {updated_business_partner_id: id, business_partner: businessPartner}
  }
})

const deleteBusinessPartners = mutationWithClientMutationId({
  name: `DeleteBusinessPartner`,
  inputFields: {
    ids: {
      type: new GraphQLList(GraphQLID)
    }
  },
  outputFields: {
    deleted_business_partners_id: {
      type: new GraphQLList(GraphQLID)
    }
  },
  mutateAndGetPayload: async ({ids}, ctx, info) => {
    let promises = []

    _.each(ids, id => {
      promises.push(
        sql('business_partner')
        .where({id})
        .del()
      )
    })

    await Promise.all(promises)

    return {deleted_business_partners_id: ids}
  }
})

export default {
  createBusinessPartner,
  updateBusinessPartner,
  deleteBusinessPartners
}
