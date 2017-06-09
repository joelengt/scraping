import sql from '../connectors'
import { NodeInterface } from './Node'
import {
  globalIdField
} from 'graphql-relay'

import {
  noop,
  idField
} from '../utils'

import { User } from './User'
import { District } from './District'

import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLID
} from 'graphql'

const Address = new GraphQLObjectType({
  name: 'Address',
  interfaces: [NodeInterface],
  fields: () => ({
    ...idField,
    user: {
      type: User,
      resolve: (obj) => {
        return sql('client')
        .where({id: obj.client_id})
        .limit(1)
        .spread(noop)
      }
    },
    district: {
      type: District,
      resolve: (obj) => {
        return sql('district')
        .where({id: obj.district_id})
        .limit(1)
        .spread(noop)
      }
    },
    address: {
      type: GraphQLString
    },
    deliveryAddress: {
      type: GraphQLString,
      resolver: () => {
        return 'av delivery_address'
      }
    },
    billAddress: {
      type: GraphQLString,
      resolver: () => {
        return 'av bill_address'
      }
    },
    reference: {
      type: GraphQLString
    },
    name: {
      type: GraphQLString
    }
  })
})

export {Address}
