import sql from '../connectors'

import { NodeInterface } from './Node'

import {
  idField,
  noop
} from '../utils'

import {Company} from './Company'

import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLBoolean
} from 'graphql'

export const Brand = new GraphQLObjectType({
  name: 'Brand',
  interfaces: [NodeInterface],
  fields: {
    ...idField,
    company: {
      type: Company,
      resolve: (obj) => {
        return sql('company')
        .where({id: obj.company_id})
        .limit(1)
        .spread(noop)
      }
    },
    name: {
      type: GraphQLString
    },
    nameSlugify: {
      type: GraphQLString
    },
    photo: {
      type: GraphQLString
    },
    description: {
      type: GraphQLString
    },
    seoDescription: {
      type: GraphQLString
    },
    isFeatured: {
      type: GraphQLBoolean
    },
    isArchived: {
      type: GraphQLBoolean
    }
  }
})
