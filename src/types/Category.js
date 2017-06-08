import sql from '../connectors'

import { NodeInterface } from './Node'

import {
  idField
} from '../utils'

import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLBoolean,
  GraphQLList
} from 'graphql'

// TODO improve category/subcategory structure

export const Category = new GraphQLObjectType({
  name: 'Category',
  interfaces: [NodeInterface],
  fields: () => ({
    ...idField,
    name: {
      type: GraphQLString
    },
    name_slugify: {
      type: GraphQLString
    },
    photo: {
      type: GraphQLString
    },
    description: {
      type: GraphQLString
    },
    level: {
      type: GraphQLInt
    },
    is_featured: {
      type: GraphQLBoolean
    },
    is_archived: {
      type: GraphQLBoolean
    },
    parentCategories: {
      type: new GraphQLList(Category),
      resolve: (obj) => {
        return sql('category_relation as cr')
        .where('child_id', obj.id)
        .innerJoin('category', (qb) => {
          qb.on('category.id', 'cr.parent_id')
        })
      }
    },
    subCategories: {
      type: new GraphQLList(Category),
      resolve: (obj) => {
        return sql('category_relation as cr')
        .where('parent_id', obj.id)
        .innerJoin('category', (qb) => {
          qb.on('category.id', 'cr.child_id')
        })
      }
    }
  })
})
