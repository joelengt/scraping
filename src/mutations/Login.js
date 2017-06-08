import sql from '../connectors'

import jwt from 'jsonwebtoken'

import {
  encryptPassword
} from '../utils/'

import {
  mutationWithClientMutationId
} from 'graphql-relay'

import {
  GraphQLNonNull,
  GraphQLString
} from 'graphql'

import {
  User
} from '../types'

const Login = mutationWithClientMutationId({
  name: `Login`,
  inputFields: {
    email: {
      type: new GraphQLNonNull(GraphQLString)
    },
    password: {
      type: new GraphQLNonNull(GraphQLString)
    }
  },
  outputFields: {
    token: {
      type: new GraphQLNonNull(GraphQLString)
    },
    user: {
      type: new GraphQLNonNull(User)
    }
  },
  mutateAndGetPayload: async ({email, password}, ctx, info) => {
    let [exist, user] = await sql('client')
    .where({email})
    .limit(1)
    .spread(user => [(user !== undefined), user])

    if (!exist) {
      throw new Error(`email doesn't exist`)
    }

    if (user.provider !== 'local') {
      throw new Error(`user isn't associated to local provider`)
    }

    let encrypted = encryptPassword(password, user.password_salt)

    if (encrypted !== user.secure_password) {
      throw new Error(`incorrect password`)
    }

    let payload = {
      role: user.is_admin ? 'admin' : 'normal',
      id: user.id
    }

    let token = jwt.sign(payload, process.env.JWT_SECRET)

    return {token, user}
  }
})

export default Login
