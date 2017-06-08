import {
  globalIdField
} from 'graphql-relay'

import {
  GraphQLID
} from 'graphql'

export const idField = {
  id: globalIdField(),
  _id: {
    type: GraphQLID,
    resolve: obj => obj.id
  }
}
