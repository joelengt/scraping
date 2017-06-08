import { Product } from './Product'
import { User } from './User'
import { Brand } from './Brand'
import { Category } from './Category'
import { Partner } from './Partner'

import _ from 'lodash'

import {
  GraphQLUnionType
} from 'graphql'

const resolveType = data => {
  if (_.has(data, 'company_id')) {
    return Brand
  }

  if (_.has(data, 'price')) {
    return Product
  }

  if (_.has(data, 'last_name')) {
    return User
  }

  if (_.has(data, 'level')) {
    return Category
  }

  if (_.has(data, 'color')) {
    return Partner
  }
}

export const Searchable = new GraphQLUnionType({
  name: 'Searchable',
  types: [Product, User, Brand, Category, Partner],
  resolveType: resolveType
})
