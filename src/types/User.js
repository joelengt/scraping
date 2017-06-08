import sql from '../connectors'
import _ from 'lodash'

import {
  noop
} from '../utils'

import {NodeInterface} from './Node'
import {BusinessType} from './BusinessType'
import {Address} from './Address'
import {Purchase} from './Purchase'
import {UserType} from './UserType'

import {
  GraphQLObjectType,
  GraphQLFloat,
  GraphQLString,
  GraphQLID,
  GraphQLList,
  GraphQLBoolean
} from 'graphql'

import {
  globalIdField
} from 'graphql-relay'

const User = new GraphQLObjectType({
  name: 'User',
  interfaces: [NodeInterface],
  fields: () => ({
    id: globalIdField(),
    _id: {
      type: GraphQLID,
      resolve: obj => obj.id
    },
    businessType: {
      type: BusinessType,
      resolve: obj => {
        return sql('business_type')
        .where({id: obj.business_type_id})
        .limit(1)
        .spread(noop)
      }
    },
    is_new_buyer: {
      type: GraphQLBoolean,
      resolve: (obj) => {
        return sql('purchase').select([
          sql.raw('COUNT(purchase.id) as total')
        ])
        .where('client_id', obj.id)
        .limit(1)
        .spread(data => (data.total === 1))
      }
    },
    name: {
      type: GraphQLString,
      resolve: (obj) => _.capitalize(_.toLower(obj.name))
    },
    last_name: {
      type: GraphQLString,
      resolve: (obj) => _.capitalize(_.toLower(obj.last_name))
    },
    full_name: {
      type: GraphQLString,
      resolve: obj => _.capitalize(_.toLower(`${obj.name} ${obj.last_name}`))
    },
    photo: {
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
    },
    provider: {
      type: GraphQLString
    },
    onboard_finished: {
      type: GraphQLBoolean
    },
    is_admin: {
      type: GraphQLBoolean
    },
    is_active: {
      type: GraphQLBoolean
    },
    is_email_verified: {
      type: GraphQLBoolean
    },
    is_archived: {
      type: GraphQLBoolean
    },
    created_at: {
      type: GraphQLFloat
    },
    updated_at: {
      type: GraphQLFloat
    },
    archived_at: {
      type: GraphQLFloat
    },
    address: {
      type: Address,
      resolve: (obj) => {
        return sql('address').where('client_id', obj.id).limit(1).spread(noop)
      }
    },
    purchases: {
      type: new GraphQLList(Purchase),
      resolve: (obj) => {
        return sql('purchase')
        .where('client_id', obj.id)
        .orderBy('created_at', 'DESC')
      }
    },
    user_type: {
      type: UserType,
      resolve: (obj) => {
        return {
          name: 'tipo de usuario'
        }
      }
    }
  })
})

export {User}
