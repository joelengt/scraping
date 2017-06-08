import sql from '../connectors'
import _ from 'lodash'

import {
  idField,
  noop
} from '../utils'

import {NodeInterface} from './Node'
import {BusinessType} from './BusinessType'
import {Address} from './Address'
import {Purchase} from './Purchase'

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

const UserType = new GraphQLObjectType({
  name: 'UserType',
  interfaces: [NodeInterface],
  fields: () => ({
    ...idField,
    name: {
      type: GraphQLString,
      resolve: (obj) => _.capitalize(_.toLower(obj.name))
    }
  })
})

export {UserType}
