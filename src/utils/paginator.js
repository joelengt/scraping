import {QBNormalizer} from './qb-normalizer'
import Promise from 'bluebird'

const pageInfo = (count, limit, page) => {
  let pages = Math.ceil(count / limit)

  return {
    count,
    pages,
    hasPrevPage: (page > 1),
    hasNextPage: (page < pages)
  }
}

export const paginator = (qb, key, {limit = 20, page = 1}) => {
  let offset = limit * (page - 1)

  let edges = qb
    .clone()
    .limit(limit)
    .offset(offset)

  let counter = QBNormalizer(qb)
    .countDistinct(`${key} AS count`)

  return Promise.props({
    edges,
    pageInfo: counter.spread(({count}) => pageInfo(count, limit, page))
  })
}
