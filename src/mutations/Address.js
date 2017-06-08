import sql from '../connectors/sql'

import {
  noop
} from '../utils'

import {
  mutationWithClientMutationId
} from 'graphql-relay'

import {
  GraphQLNonNull,
  GraphQLID,
  GraphQLString
} from 'graphql'

import {
  Address
} from '../types'

const createAddress = mutationWithClientMutationId({
  name: `CreateAddress`,
  inputFields: {
    district_id: {
      type: new GraphQLNonNull(GraphQLID)
    },
    client_id: {
      type: new GraphQLNonNull(GraphQLID)
    },
    address: {
      type: GraphQLString
    },
    reference: {
      type: GraphQLString
    }
  },
  outputFields: {
    created_address_id: {
      type: new GraphQLNonNull(GraphQLID)
    },
    address: {
      type: Address
    }
  },
  mutateAndGetPayload: async (address, ctx, info) => {
    let client = await sql('client').where({id: address.client_id}).limit(1).spread(noop)

    if (!client) {
      throw new Error(`Client with id ${address.client_id} doesn't exist`)
    }

    let id = await sql('address').insert(address).spread(noop)

    address = await sql('address').where({id}).limit(1).spread(noop)

    return {created_address_id: id, address}
  }
})

const updateAddress = mutationWithClientMutationId({
  name: `UpdateAddress`,
  inputFields: {
    id: {
      type: new GraphQLNonNull(GraphQLID)
    },
    district_id: {
      type: new GraphQLNonNull(GraphQLID)
    },
    address: {
      type: GraphQLString
    },
    reference: {
      type: GraphQLString
    }
  },
  outputFields: {
    updated_address_id: {
      type: new GraphQLNonNull(GraphQLID)
    },
    address: {
      type: Address
    }
  },
  mutateAndGetPayload: async (address, ctx, info) => {
    let {id} = address

    await sql('address').update(address).where({id})

    address = await sql('address').where({id}).limit(1).spread(noop)

    return {updated_address_id: id, address}
  }
})

export default {createAddress, updateAddress}
