import sql from '../connectors/sql'

import uuid from 'uuid'
import crypto from 'crypto'

import {
  noop,
  encryptPassword
} from '../utils'

import {
  mutationWithClientMutationId
} from 'graphql-relay'

import {
  GraphQLNonNull,
  GraphQLID,
  GraphQLString,
  GraphQLFloat
} from 'graphql'

import {
  User
} from '../types'

const debug = require('debug')('riqra-api:mutations:user')

const verifyEmail = (email) => {
  return sql('client')
  .where({email})
  .limit(1)
  .spread(userDB => {
    if (userDB !== undefined) {
      throw new Error(`Ya existe un cliente con el correo ${email}`)
    }
  })
}

// TODO add ruc/dni in create user mutation
const createUser = mutationWithClientMutationId({
  name: `CreateUser`,
  inputFields: {
    name: {
      type: new GraphQLNonNull(GraphQLString)
    },
    last_name: {
      type: new GraphQLNonNull(GraphQLString)
    },
    email: {
      type: new GraphQLNonNull(GraphQLString)
    },
    password: {
      type: new GraphQLNonNull(GraphQLString)
    },
    phone: {
      type: GraphQLString
    },
    business_name: {
      type: GraphQLString
    },
    business_type_id: {
      type: GraphQLID
    },
    fiscal_name: {
      type: GraphQLString
    },
    fiscal_address: {
      type: GraphQLString
    },
    ruc: {
      type: GraphQLString
    },
    dni: {
      type: GraphQLString
    }
  },
  outputFields: {
    created_user_id: {
      type: new GraphQLNonNull(GraphQLID)
    },
    user: {
      type: User
    }
  },
  mutateAndGetPayload: async (user, ctx, info) => {
    await verifyEmail(user.email)

    user.provider = 'local'
    user.token_email_verification = uuid.v4()
    user.password_salt = crypto.randomBytes(16).toString('base64')
    user.secure_password = encryptPassword(user.password, user.password_salt)

    delete user.password

    debug(user)

    let id = await sql('client').insert(user).spread(noop)

    user = await sql('client').where({id}).limit(1).spread(noop)

    return {created_user_id: id, user}
  }
})

const updateUser = mutationWithClientMutationId({
  name: `UpdateUser`,
  inputFields: {
    id: {
      type: new GraphQLNonNull(GraphQLID)
    },
    name: {
      type: GraphQLString
    },
    last_name: {
      type: GraphQLString
    },
    email: {
      type: GraphQLString
    },
    phone: {
      type: GraphQLString
    },
    business_name: {
      type: GraphQLString
    },
    business_type_id: {
      type: GraphQLID
    },
    fiscal_name: {
      type: GraphQLString
    },
    fiscal_address: {
      type: GraphQLString
    },
    ruc: {
      type: GraphQLString
    },
    dni: {
      type: GraphQLString
    }
  },
  outputFields: {
    updated_user_id: {
      type: new GraphQLNonNull(GraphQLID)
    },
    user: {
      type: User
    }
  },
  mutateAndGetPayload: async (user, ctx, info) => {
    let currentUser = await sql('client').where('id', user.id).limit(1).spread(noop)

    if (currentUser.email !== user.email && user.email) {
      await verifyEmail(user.email)
    }

    console.log('after verification')

    let {id} = user

    await sql('client').update(user).where({id})

    user = await sql('client').where({id}).limit(1).spread(noop)

    return {updated_user_id: id, user}
  }
})

export default {createUser, updateUser}
