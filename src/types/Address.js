import sql from '../connectors'
import { NodeInterface } from './Node'
import {
  globalIdField
} from 'graphql-relay'

import {
  noop
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
    id: globalIdField(),
    _id: {
      type: GraphQLID,
      resolve: obj => obj.id
    },
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
    delivery_address: {
      type: GraphQLString,
      resolver: (obj) => {
        return 'av delivery_address'
      }
    },
    bill_address: {
      type: GraphQLString,
      resolver: (obj) => {
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
