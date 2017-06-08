import sql from '../connectors'
import _ from 'lodash'
import Promise from 'bluebird'

export const stock = (purchase, operation) => {
  return sql('purchase_item')
  .select(['product_id', 'quantity'])
  .where({purchase_id: purchase.id})
  .then(items => {
    let promises = []
    _.each(items, (item, key) => {
      let qb = sql('product')
      qb[operation]('stock', item.quantity)

      qb.where({id: item.product_id})

      promises.push(qb)
    })

    return Promise.all(promises)
  })
}
