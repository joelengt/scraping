import { NodeInterface } from './Node'

import {
  idField
} from '../utils'

import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLBoolean
} from 'graphql'

export const Ads = new GraphQLObjectType({
  name: 'Ads',
  interfaces: [NodeInterface],
  fields: {
    ...idField,
    name: {
      type: GraphQLString
    },
    photo: {
      type: GraphQLString
    },
    link: {
      type: GraphQLString
    },
    is_archived: {
      type: GraphQLBoolean,
      resolve: () => {
        return false
      }
    }
  }
})
