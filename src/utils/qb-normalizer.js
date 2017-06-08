import _ from 'lodash'

export const QBNormalizer = qb => {
  let query = qb.clone()

  let notNeededQueries = [
    'orderByBasic',
    'orderByRaw',
    'groupByBasic',
    'groupByRaw'
  ]

  _.remove(query._statements, function (statement) {
    return (notNeededQueries.indexOf(statement.type) > -1) ||
      statement.grouping === 'columns'
  })

  return query
}
